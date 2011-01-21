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

#ifndef _SLANG_COMPILER_RS_EXPORTABLE_HPP
#define _SLANG_COMPILER_RS_EXPORTABLE_HPP

#include "slang_rs_context.h"

namespace slang {

class RSExportable {
 public:
  enum Kind {
    EX_FUNC,
    EX_TYPE,
    EX_VAR
  };

 private:
  RSContext *mContext;

  Kind mK;

 protected:
  RSExportable(RSContext *Context, RSExportable::Kind K)
      : mContext(Context),
        mK(K) {
    Context->newExportable(this);
    return;
  }

 public:
  inline Kind getKind() const { return mK; }

  // When keep() is invoked, mKeep will set to true and the associated RSContext
  // won't free this RSExportable object in its destructor. The deallcation
  // responsibility is then transferred to the object who invoked this function.
  virtual void keep();
  inline bool isKeep() const { return (mContext == NULL); }

  virtual bool equals(const RSExportable *E) const;

  inline RSContext *getRSContext() const { return mContext; }

  virtual ~RSExportable() { }
};
}

#endif  // _SLANG_COMPILER_RS_EXPORTABLE_HPP
