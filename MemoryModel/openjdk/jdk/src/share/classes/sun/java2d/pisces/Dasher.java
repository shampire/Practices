/*
 * Copyright (c) 2007, 2010, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */

package sun.java2d.pisces;

import sun.awt.geom.PathConsumer2D;

/**
 * The <code>Dasher</code> class takes a series of linear commands
 * (<code>moveTo</code>, <code>lineTo</code>, <code>close</code> and
 * <code>end</code>) and breaks them into smaller segments according to a
 * dash pattern array and a starting dash phase.
 *
 * <p> Issues: in J2Se, a zero length dash segment as drawn as a very
 * short dash, whereas Pisces does not draw anything.  The PostScript
 * semantics are unclear.
 *
 */
public class Dasher implements sun.awt.geom.PathConsumer2D {

    private final PathConsumer2D out;
    private final float[] dash;
    private final float startPhase;
    private final boolean startDashOn;
    private final int startIdx;

    private boolean starting;
    private boolean needsMoveTo;

    private int idx;
    private boolean dashOn;
    private float phase;

    private float sx, sy;
    private float x0, y0;

    // temporary storage for the current curve
    private float[] curCurvepts;

    /**
     * Constructs a <code>Dasher</code>.
     *
     * @param out an output <code>PathConsumer2D</code>.
     * @param dash an array of <code>float</code>s containing the dash pattern
     * @param phase a <code>float</code> containing the dash phase
     */
    public Dasher(PathConsumer2D out, float[] dash, float phase) {
        if (phase < 0) {
            throw new IllegalArgumentException("phase < 0 !");
        }

        this.out = out;

        // Normalize so 0 <= phase < dash[0]
        int idx = 0;
        dashOn = true;
        float d;
        while (phase >= (d = dash[idx])) {
            phase -= d;
            idx = (idx + 1) % dash.length;
            dashOn = !dashOn;
        }

        this.dash = dash;
        this.startPhase = this.phase = phase;
        this.startDashOn = dashOn;
        this.startIdx = idx;
        this.starting = true;

        // we need curCurvepts to be able to contain 2 curves because when
        // dashing curves, we need to subdivide it
        curCurvepts = new float[8 * 2];
    }

    public void moveTo(float x0, float y0) {
        if (firstSegidx > 0) {
            out.moveTo(sx, sy);
            emitFirstSegments();
        }
        needsMoveTo = true;
        this.idx = startIdx;
        this.dashOn = this.startDashOn;
        this.phase = this.startPhase;
        this.sx = this.x0 = x0;
        this.sy = this.y0 = y0;
        this.starting = true;
    }

    private void emitSeg(float[] buf, int off, int type) {
        switch (type) {
        case 8:
            out.curveTo(buf[off+0], buf[off+1],
                        buf[off+2], buf[off+3],
                        buf[off+4], buf[off+5]);
            break;
        case 6:
            out.quadTo(buf[off+0], buf[off+1],
                       buf[off+2], buf[off+3]);
            break;
        case 4:
            out.lineTo(buf[off], buf[off+1]);
        }
    }

    private void emitFirstSegments() {
        for (int i = 0; i < firstSegidx; ) {
            emitSeg(firstSegmentsBuffer, i+1, (int)firstSegmentsBuffer[i]);
            i += (((int)firstSegmentsBuffer[i]) - 1);
        }
        firstSegidx = 0;
    }

    // We don't emit the first dash right away. If we did, caps would be
    // drawn on it, but we need joins to be drawn if there's a closePath()
    // So, we store the path elements that make up the first dash in the
    // buffer below.
    private float[] firstSegmentsBuffer = new float[7];
    private int firstSegidx = 0;
    // precondition: pts must be in relative coordinates (relative to x0,y0)
    // fullCurve is true iff the curve in pts has not been split.
    private void goTo(float[] pts, int off, final int type) {
        float x = pts[off + type - 4];
        float y = pts[off + type - 3];
        if (dashOn) {
            if (starting) {
                firstSegmentsBuffer = Helpers.widenArray(firstSegmentsBuffer,
                                      firstSegidx, type - 2);
                firstSegmentsBuffer[firstSegidx++] = type;
                System.arraycopy(pts, off, firstSegmentsBuffer, firstSegidx, type - 2);
                firstSegidx += type - 2;
            } else {
                if (needsMoveTo) {
                    out.moveTo(x0, y0);
                    needsMoveTo = false;
                }
                emitSeg(pts, off, type);
            }
        } else {
            starting = false;
            needsMoveTo = true;
        }
        this.x0 = x;
        this.y0 = y;
    }

    public void lineTo(float x1, float y1) {
        float dx = x1 - x0;
        float dy = y1 - y0;

        float len = (float) Math.hypot(dx, dy);

        if (len == 0) {
            return;
        }

        // The scaling factors needed to get the dx and dy of the
        // transformed dash segments.
        float cx = dx / len;
        float cy = dy / len;

        while (true) {
            float leftInThisDashSegment = dash[idx] - phase;
            if (len <= leftInThisDashSegment) {
                curCurvepts[0] = x1;
                curCurvepts[1] = y1;
                goTo(curCurvepts, 0, 4);
                // Advance phase within current dash segment
                phase += len;
                if (len == leftInThisDashSegment) {
                    phase = 0f;
                    idx = (idx + 1) % dash.length;
                    dashOn = !dashOn;
                }
                return;
            }

            float dashdx = dash[idx] * cx;
            float dashdy = dash[idx] * cy;
            if (phase == 0) {
                curCurvepts[0] = x0 + dashdx;
                curCurvepts[1] = y0 + dashdy;
            } else {
                float p = leftInThisDashSegment / dash[idx];
                curCurvepts[0] = x0 + p * dashdx;
                curCurvepts[1] = y0 + p * dashdy;
            }

            goTo(curCurvepts, 0, 4);

            len -= leftInThisDashSegment;
            // Advance to next dash segment
            idx = (idx + 1) % dash.length;
            dashOn = !dashOn;
            phase = 0;
        }
    }

    private LengthIterator li = null;

    // preconditions: curCurvepts must be an array of length at least 2 * type,
    // that contains the curve we want to dash in the first type elements
    private void somethingTo(int type) {
        if (pointCurve(curCurvepts, type)) {
            return;
        }
        if (li == null) {
            li = new LengthIterator(4, 0.0001f);
        }
        li.initializeIterationOnCurve(curCurvepts, type);

        int curCurveoff = 0; // initially the current curve is at curCurvepts[0...type]
        float lastSplitT = 0;
        float t = 0;
        float leftInThisDashSegment = dash[idx] - phase;
        while ((t = li.next(leftInThisDashSegment)) < 1) {
            if (t != 0) {
                Helpers.subdivideAt((t - lastSplitT) / (1 - lastSplitT),
                        curCurvepts, curCurveoff,
                        curCurvepts, 0,
                        curCurvepts, type, type);
                lastSplitT = t;
                goTo(curCurvepts, 2, type);
                curCurveoff = type;
            }
            // Advance to next dash segment
            idx = (idx + 1) % dash.length;
            dashOn = !dashOn;
            phase = 0;
            leftInThisDashSegment = dash[idx];
        }
        goTo(curCurvepts, curCurveoff+2, type);
        phase += li.lastSegLen();
        if (phase >= dash[idx]) {
            phase = 0f;
            idx = (idx + 1) % dash.length;
            dashOn = !dashOn;
        }
    }

    private static boolean pointCurve(float[] curve, int type) {
        for (int i = 2; i < type; i++) {
            if (curve[i] != curve[i-2]) {
                return false;
            }
        }
        return true;
    }

    // Objects of this class are used to iterate through curves. They return
    // t values where the left side of the curve has a specified length.
    // It does this by subdividing the input curve until a certain error
    // condition has been met. A recursive subdivision procedure would
    // return as many as 1<<limit curves, but this is an iterator and we
    // don't need all the curves all at once, so what we carry out a
    // lazy inorder traversal of the recursion tree (meaning we only move
    // through the tree when we need the next subdivided curve). This saves
    // us a lot of memory because at any one time we only need to store
    // limit+1 curves - one for each level of the tree + 1.
    // NOTE: the way we do things here is not enough to traverse a general
    // tree; however, the trees we are interested in have the property that
    // every non leaf node has exactly 2 children
    private static class LengthIterator {
        private enum Side {LEFT, RIGHT};
        // Holds the curves at various levels of the recursion. The root
        // (i.e. the original curve) is at recCurveStack[0] (but then it
        // gets subdivided, the left half is put at 1, so most of the time
        // only the right half of the original curve is at 0)
        private float[][] recCurveStack;
        // sides[i] indicates whether the node at level i+1 in the path from
        // the root to the current leaf is a left or right child of its parent.
        private Side[] sides;
        private int curveType;
        private final int limit;
        private final float ERR;
        private final float minTincrement;
        // lastT and nextT delimit the current leaf.
        private float nextT;
        private float lenAtNextT;
        private float lastT;
        private float lenAtLastT;
        private float lenAtLastSplit;
        private float lastSegLen;
        // the current level in the recursion tree. 0 is the root. limit
        // is the deepest possible leaf.
        private int recLevel;
        private boolean done;

        public LengthIterator(int reclimit, float err) {
            this.limit = reclimit;
            this.minTincrement = 1f / (1 << limit);
            this.ERR = err;
            this.recCurveStack = new float[reclimit+1][8];
            this.sides = new Side[reclimit];
            // if any methods are called without first initializing this object on
            // a curve, we want it to fail ASAP.
            this.nextT = Float.MAX_VALUE;
            this.lenAtNextT = Float.MAX_VALUE;
            this.lenAtLastSplit = Float.MIN_VALUE;
            this.recLevel = Integer.MIN_VALUE;
            this.lastSegLen = Float.MAX_VALUE;
            this.done = true;
        }

        public void initializeIterationOnCurve(float[] pts, int type) {
            System.arraycopy(pts, 0, recCurveStack[0], 0, type);
            this.curveType = type;
            this.recLevel = 0;
            this.lastT = 0;
            this.lenAtLastT = 0;
            this.nextT = 0;
            this.lenAtNextT = 0;
            goLeft(); // initializes nextT and lenAtNextT properly
            this.lenAtLastSplit = 0;
            if (recLevel > 0) {
                this.sides[0] = Side.LEFT;
                this.done = false;
            } else {
                // the root of the tree is a leaf so we're done.
                this.sides[0] = Side.RIGHT;
                this.done = true;
            }
            this.lastSegLen = 0;
        }

        // returns the t value where the remaining curve should be split in
        // order for the left subdivided curve to have length len. If len
        // is >= than the length of the uniterated curve, it returns 1.
        public float next(float len) {
            float targetLength = lenAtLastSplit + len;
            while(lenAtNextT < targetLength) {
                if (done) {
                    lastSegLen = lenAtNextT - lenAtLastSplit;
                    return 1;
                }
                goToNextLeaf();
            }
            lenAtLastSplit = targetLength;
            float t = binSearchForLen(lenAtLastSplit - lenAtLastT,
                    recCurveStack[recLevel], curveType, lenAtNextT - lenAtLastT, ERR);
            // t is relative to the current leaf, so we must make it a valid parameter
            // of the original curve.
            t = t * (nextT - lastT) + lastT;
            if (t >= 1) {
                t = 1;
                done = true;
            }
            // even if done = true, if we're here, that means targetLength
            // is equal to, or very, very close to the total length of the
            // curve, so lastSegLen won't be too high. In cases where len
            // overshoots the curve, this method will exit in the while
            // loop, and lastSegLen will still be set to the right value.
            lastSegLen = len;
            return t;
        }

        public float lastSegLen() {
            return lastSegLen;
        }

        // Returns t such that if leaf is subdivided at t the left
        // curve will have length len. leafLen must be the length of leaf.
        private static Curve bsc = new Curve();
        private static float binSearchForLen(float len, float[] leaf, int type,
                                             float leafLen, float err)
        {
            assert len <= leafLen;
            bsc.set(leaf, type);
            float errBound = err*len;
            float left = 0, right = 1;
            while (left < right) {
                float m = (left + right) / 2;
                if (m == left || m == right) {
                    return m;
                }
                float x = bsc.xat(m);
                float y = bsc.yat(m);
                float leftLen = Helpers.linelen(leaf[0], leaf[1], x, y);
                if (Math.abs(leftLen - len) < errBound) {
                    return m;
                }
                if (leftLen < len) {
                    left = m;
                } else {
                    right = m;
                }
            }
            return left;
        }

        // go to the next leaf (in an inorder traversal) in the recursion tree
        // preconditions: must be on a leaf, and that leaf must not be the root.
        private void goToNextLeaf() {
            // We must go to the first ancestor node that has an unvisited
            // right child.
            recLevel--;
            while(sides[recLevel] == Side.RIGHT) {
                if (recLevel == 0) {
                    done = true;
                    return;
                }
                recLevel--;
            }

            sides[recLevel] = Side.RIGHT;
            System.arraycopy(recCurveStack[recLevel], 0, recCurveStack[recLevel+1], 0, curveType);
            recLevel++;
            goLeft();
        }

        // go to the leftmost node from the current node. Return its length.
        private void goLeft() {
            float len = onLeaf();
            if (len >= 0) {
                lastT = nextT;
                lenAtLastT = lenAtNextT;
                nextT += (1 << (limit - recLevel)) * minTincrement;
                lenAtNextT += len;
            } else {
                Helpers.subdivide(recCurveStack[recLevel], 0,
                                  recCurveStack[recLevel+1], 0,
                                  recCurveStack[recLevel], 0, curveType);
                sides[recLevel] = Side.LEFT;
                recLevel++;
                goLeft();
            }
        }

        // this is a bit of a hack. It returns -1 if we're not on a leaf, and
        // the length of the leaf if we are on a leaf.
        private float onLeaf() {
            float polylen = Helpers.polyLineLength(recCurveStack[recLevel], 0, curveType);
            float linelen = Helpers.linelen(recCurveStack[recLevel][0], recCurveStack[recLevel][1],
                    recCurveStack[recLevel][curveType - 2], recCurveStack[recLevel][curveType - 1]);
            return (polylen - linelen < ERR || recLevel == limit) ?
                   (polylen + linelen)/2 : -1;
        }
    }

    @Override
    public void curveTo(float x1, float y1,
                        float x2, float y2,
                        float x3, float y3)
    {
        curCurvepts[0] = x0;        curCurvepts[1] = y0;
        curCurvepts[2] = x1;        curCurvepts[3] = y1;
        curCurvepts[4] = x2;        curCurvepts[5] = y2;
        curCurvepts[6] = x3;        curCurvepts[7] = y3;
        somethingTo(8);
    }

    @Override
    public void quadTo(float x1, float y1, float x2, float y2) {
        curCurvepts[0] = x0;        curCurvepts[1] = y0;
        curCurvepts[2] = x1;        curCurvepts[3] = y1;
        curCurvepts[4] = x2;        curCurvepts[5] = y2;
        somethingTo(6);
    }

    public void closePath() {
        lineTo(sx, sy);
        if (firstSegidx > 0) {
            if (!dashOn || needsMoveTo) {
                out.moveTo(sx, sy);
            }
            emitFirstSegments();
        }
        moveTo(sx, sy);
    }

    public void pathDone() {
        if (firstSegidx > 0) {
            out.moveTo(sx, sy);
            emitFirstSegments();
        }
        out.pathDone();
    }

    @Override
    public long getNativeConsumer() {
        throw new InternalError("Dasher does not use a native consumer");
    }
}

