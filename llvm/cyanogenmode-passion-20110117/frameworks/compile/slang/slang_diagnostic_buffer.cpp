/*
 * Copyright 2010, The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "slang_diagnostic_buffer.h"

#include "llvm/ADT/SmallString.h"

#include "clang/Basic/SourceManager.h"
#include "clang/Basic/SourceLocation.h"

using namespace slang;

DiagnosticBuffer::DiagnosticBuffer() : mSOS(NULL) {
  mSOS = new llvm::raw_string_ostream(mDiags);
  return;
}

void DiagnosticBuffer::HandleDiagnostic(clang::Diagnostic::Level DiagLevel,
                                        const clang::DiagnosticInfo &Info) {
  const clang::FullSourceLoc &FSLoc = Info.getLocation();
  // 100 is enough for storing general diagnosis message
  llvm::SmallString<100> Buf;

  if (FSLoc.isValid()) {
    FSLoc.print(*mSOS, FSLoc.getManager());
    (*mSOS) << ": ";
  }

  switch (DiagLevel) {
    case clang::Diagnostic::Note: {
      (*mSOS) << "note: ";
      break;
    }
    case clang::Diagnostic::Warning: {
      (*mSOS) << "warning: ";
      break;
    }
    case clang::Diagnostic::Error: {
      (*mSOS) << "error: ";
      break;
    }
    case clang::Diagnostic::Fatal: {
      (*mSOS) << "fatal: ";
      break;
    }
    default: {
      assert(0 && "Diagnostic not handled during diagnostic buffering!");
    }
  }


  Info.FormatDiagnostic(Buf);
  (*mSOS) << Buf.str() << '\n';

  return;
}

DiagnosticBuffer::~DiagnosticBuffer() {
  delete mSOS;
  return;
}
