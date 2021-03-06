/*
 * Copyright (c) 2009, 2010, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.
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

import java.nio.file.*;
import java.net.*;
import java.util.*;
import java.io.IOException;

/**
 * Tests path operations for zip provider.
 */

public class PathOps {

    static final java.io.PrintStream out = System.out;
    static FileSystem fs;

    private String input;
    private Path path;
    private Exception exc;

    private PathOps(String s) {
        out.println();
        input = s;
        try {
            path = fs.getPath(s);
            out.format("%s -> %s", s, path);
        } catch (Exception x) {
            exc = x;
            out.format("%s -> %s", s, x);
        }
        out.println();
    }

    Path path() {
        return path;
    }

    void fail() {
        throw new RuntimeException("PathOps failed");
    }

    void checkPath() {
        if (path == null) {
            throw new InternalError("path is null");
        }
    }

    void check(Object result, String expected) {
        out.format("\tExpected: %s\n", expected);
        out.format("\tActual: %s\n",  result);
        if (result == null) {
            if (expected == null) return;
        } else {
            // compare string representations
            if (expected != null && result.toString().equals(expected.toString()))
                return;
        }
        fail();
    }

    void check(Object result, boolean expected) {
        check(result, Boolean.toString(expected));
    }

    PathOps root(String expected) {
        out.println("check root");
        checkPath();
        check(path.getRoot(), expected);
        return this;
    }

    PathOps parent(String expected) {
        out.println("check parent");
        checkPath();
        check(path.getParent(), expected);
        return this;
    }

    PathOps name(String expected) {
        out.println("check name");
        checkPath();
        check(path.getName(), expected);
        return this;
    }

    PathOps element(int index, String expected) {
        out.format("check element %d\n", index);
        checkPath();
        check(path.getName(index), expected);
        return this;
    }

    PathOps subpath(int startIndex, int endIndex, String expected) {
        out.format("test subpath(%d,%d)\n", startIndex, endIndex);
        checkPath();
        check(path.subpath(startIndex, endIndex), expected);
        return this;
    }

    PathOps starts(String prefix) {
        out.format("test startsWith with %s\n", prefix);
        checkPath();
        Path s = fs.getPath(prefix);
        check(path.startsWith(s), true);
        return this;
    }

    PathOps notStarts(String prefix) {
        out.format("test not startsWith with %s\n", prefix);
        checkPath();
        Path s = fs.getPath(prefix);
        check(path.startsWith(s), false);
        return this;
    }

    PathOps ends(String suffix) {
        out.format("test endsWith %s\n", suffix);
        checkPath();
        Path s = fs.getPath(suffix);
        check(path.endsWith(s), true);
        return this;
    }

    PathOps notEnds(String suffix) {
        out.format("test not endsWith %s\n", suffix);
        checkPath();
        Path s = fs.getPath(suffix);
        check(path.endsWith(s), false);
        return this;
    }

    PathOps absolute() {
        out.println("check path is absolute");
        checkPath();
        check(path.isAbsolute(), true);
        return this;
    }

    PathOps notAbsolute() {
        out.println("check path is not absolute");
        checkPath();
        check(path.isAbsolute(), false);
        return this;
    }

    PathOps resolve(String other, String expected) {
        out.format("test resolve %s\n", other);
        checkPath();
        check(path.resolve(other), expected);
        return this;
    }

    PathOps relativize(String other, String expected) {
        out.format("test relativize %s\n", other);
        checkPath();
        Path that = fs.getPath(other);
        check(path.relativize(that), expected);
        return this;
    }

    PathOps normalize(String expected) {
        out.println("check normalized path");
        checkPath();
        check(path.normalize(), expected);
        return this;
    }

    PathOps string(String expected) {
        out.println("check string representation");
        checkPath();
        check(path, expected);
        return this;
    }

    PathOps invalid() {
        if (!(exc instanceof InvalidPathException)) {
            out.println("InvalidPathException not thrown as expected");
            fail();
        }
        return this;
    }

    static PathOps test(String s) {
        return new PathOps(s);
    }

    // -- PathOpss --

    static void header(String s) {
        out.println();
        out.println();
        out.println("-- " + s + " --");
    }

    static void doPathOpTests() {
        header("Path operations");

        // all components
        test("/a/b/c")
            .root("/")
            .parent("/a/b")
            .name("c");

        // root component only
        test("/")
            .root("/")
            .parent(null)
            .name(null);

        // no root component
        test("a/b")
            .root(null)
            .parent("a")
            .name("b");

        // name component only
        test("foo")
            .root(null)
            .parent(null)
            .name("foo");

        // startsWith
        test("/")
            .starts("/")
            .notStarts("/foo");
        test("/foo")
            .starts("/")
            .starts("/foo")
            .notStarts("/f");
        test("/foo/bar")
            .starts("/")
            .starts("/foo")
            .starts("/foo/bar")
            .notStarts("/f")
            .notStarts("foo")
            .notStarts("foo/bar");
        test("foo")
            .starts("foo")
            .notStarts("f");
        test("foo/bar")
            .starts("foo")
            .starts("foo/bar")
            .notStarts("f")
            .notStarts("/foo")
            .notStarts("/foo/bar");

        // endsWith
        test("/")
            .ends("/")
            .notEnds("foo")
            .notEnds("/foo");
        test("/foo")
            .ends("foo")
            .ends("/foo")
            .notEnds("/");
        test("/foo/bar")
            .ends("bar")
            .ends("foo/bar")
            .ends("/foo/bar")
            .notEnds("/bar");
        test("foo")
            .ends("foo");
        test("foo/bar")
            .ends("bar")
            .ends("foo/bar");

        // elements
        test("a/b/c")
            .element(0,"a")
            .element(1,"b")
            .element(2,"c");

        // isAbsolute
        test("/")
            .absolute();
        test("/tmp")
            .absolute();
        test("tmp")
            .notAbsolute();

        // resolve
        test("/tmp")
            .resolve("foo", "/tmp/foo")
            .resolve("/foo", "/foo");
        test("tmp")
            .resolve("foo", "tmp/foo")
            .resolve("/foo", "/foo");

        // relativize
        test("/a/b/c")
            .relativize("/a/b/c", null)
            .relativize("/a/b/c/d/e", "d/e")
            .relativize("/a/x", "../../x");

        // normalize
        test("/")
            .normalize("/");
        test("foo")
            .normalize("foo");
        test("/foo")
            .normalize("/foo");
        test(".")
            .normalize(null);
        test("..")
            .normalize("..");
        test("/..")
            .normalize("/");
        test("/../..")
            .normalize("/");
        test("foo/.")
            .normalize("foo");
        test("./foo")
            .normalize("foo");
        test("foo/..")
            .normalize(null);
        test("../foo")
            .normalize("../foo");
        test("../../foo")
            .normalize("../../foo");
        test("foo/bar/..")
            .normalize("foo");
        test("foo/bar/gus/../..")
            .normalize("foo");
        test("/foo/bar/gus/../..")
            .normalize("/foo");

        // invalid
        test("foo\u0000bar")
            .invalid();
        test("\u0000foo")
            .invalid();
        test("bar\u0000")
            .invalid();
        test("//foo\u0000bar")
            .invalid();
        test("//\u0000foo")
            .invalid();
        test("//bar\u0000")
            .invalid();

        // normalization
        test("//foo//bar")
            .string("/foo/bar")
            .root("/")
            .parent("/foo")
            .name("bar");
    }

    static void npes() {
        header("NullPointerException");

        Path path = fs.getPath("foo");

        try {
            path.resolve((String)null);
            throw new RuntimeException("NullPointerException not thrown");
        } catch (NullPointerException npe) {
        }

        try {
            path.relativize(null);
            throw new RuntimeException("NullPointerException not thrown");
        } catch (NullPointerException npe) {
        }

        try {
            path.compareTo(null);
            throw new RuntimeException("NullPointerException not thrown");
        } catch (NullPointerException npe) {
        }

        try {
            path.startsWith(null);
            throw new RuntimeException("NullPointerException not thrown");
        } catch (NullPointerException npe) {
        }

        try {
            path.endsWith(null);
            throw new RuntimeException("NullPointerException not thrown");
        } catch (NullPointerException npe) {
        }

    }

    public static void main(String[] args) throws Throwable {

        Path zipfile = Paths.get(args[0]);
        Map<String,?> env = new HashMap<String,Object>();
        fs = FileSystems.newFileSystem(zipfile, env, null);
        npes();
        doPathOpTests();
        fs.close();
    }
}
