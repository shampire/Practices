#
# Copyright (C) 2010 The Android Open Source Project
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
LOCAL_PATH := $(call my-dir)

# Shared library libslang for host
# ========================================================
include $(CLEAR_VARS)
include $(CLEAR_TBLGEN_VARS)

LLVM_ROOT_PATH := external/llvm
CLANG_ROOT_PATH := external/clang

include $(CLANG_ROOT_PATH)/clang.mk

LOCAL_MODULE := libslang
LOCAL_MODULE_TAGS := optional

LOCAL_MODULE_CLASS := SHARED_LIBRARIES

LOCAL_CFLAGS += -Wno-sign-promo

TBLGEN_TABLES :=    \
	AttrList.inc	\
	Attrs.inc	\
	DeclNodes.inc	\
	DiagnosticCommonKinds.inc	\
	DiagnosticFrontendKinds.inc	\
	DiagnosticSemaKinds.inc	\
	StmtNodes.inc

LOCAL_SRC_FILES :=	\
	slang.cpp	\
	slang_utils.cpp	\
	slang_backend.cpp	\
	slang_pragma_recorder.cpp	\
	slang_diagnostic_buffer.cpp

LOCAL_STATIC_LIBRARIES :=	\
	libLLVMLinker   \
	libLLVMipo	\
	libLLVMBitWriter	\
	libLLVMBitReader	\
	libLLVMARMAsmPrinter	\
	libLLVMX86AsmPrinter	\
	libLLVMAsmPrinter	\
	libLLVMMCParser	\
	libLLVMARMCodeGen	\
	libLLVMARMInfo	\
	libLLVMX86CodeGen	\
	libLLVMX86Info	\
	libLLVMSelectionDAG	\
	libLLVMCodeGen	\
	libLLVMScalarOpts	\
	libLLVMInstCombine	\
	libLLVMTransformUtils	\
	libLLVMInstrumentation	\
	libLLVMipa	\
	libLLVMAnalysis	\
	libLLVMTarget	\
	libLLVMMC	\
	libLLVMCore	\
	libclangParse	\
	libclangSema	\
	libclangAnalysis	\
	libclangAST	\
	libclangLex	\
	libclangFrontend	\
	libclangCodeGen	\
	libclangBasic	\
	libLLVMSupport	\
	libLLVMSystem

LOCAL_LDLIBS := -ldl -lpthread

include $(CLANG_HOST_BUILD_MK)
include $(CLANG_TBLGEN_RULES_MK)
include $(LLVM_GEN_INTRINSICS_MK)
include $(BUILD_HOST_SHARED_LIBRARY)

# Host static library containing rslib.bc
# ========================================================
include $(CLEAR_VARS)

input_data_file := frameworks/compile/slang/rslib.bc
slangdata_output_var_name := rslib_bc

LOCAL_IS_HOST_MODULE := true
LOCAL_MODULE := librslib
LOCAL_MODULE_TAGS := optional

include $(LOCAL_PATH)/SlangData.mk
include $(BUILD_HOST_STATIC_LIBRARY)

# Executable llvm-rs-link for host
# ========================================================
include $(CLEAR_VARS)
include $(CLEAR_TBLGEN_VARS)

include $(LLVM_ROOT_PATH)/llvm.mk

LOCAL_MODULE := llvm-rs-link
LOCAL_MODULE_TAGS := optional

LOCAL_MODULE_CLASS := EXECUTABLES

LOCAL_SRC_FILES :=	\
	llvm-rs-link.cpp

LOCAL_SHARED_LIBRARIES :=	\
	libslang

LOCAL_STATIC_LIBRARIES :=	\
	librslib

LOCAL_LDLIBS := -ldl -lpthread

include $(LLVM_HOST_BUILD_MK)
include $(LLVM_GEN_INTRINSICS_MK)
include $(BUILD_HOST_EXECUTABLE)

# Executable rs-spec-gen for host
# ========================================================
include $(CLEAR_VARS)

LOCAL_MODULE := rs-spec-gen
LOCAL_MODULE_TAGS := optional

LOCAL_MODULE_CLASS := EXECUTABLES

LOCAL_SRC_FILES :=	\
	slang_rs_spec_table.cpp

include $(BUILD_HOST_EXECUTABLE)

# Executable llvm-rs-cc for host
# ========================================================
include $(CLEAR_VARS)
include $(CLEAR_TBLGEN_VARS)

LOCAL_IS_HOST_MODULE := true
LOCAL_MODULE := llvm-rs-cc
LOCAL_MODULE_TAGS := optional

LOCAL_MODULE_CLASS := EXECUTABLES

LOCAL_CFLAGS += -Wno-sign-promo

TBLGEN_TABLES :=    \
	AttrList.inc    \
	Attrs.inc    \
	DeclNodes.inc    \
	DiagnosticCommonKinds.inc   \
	DiagnosticDriverKinds.inc	\
	DiagnosticFrontendKinds.inc	\
	DiagnosticSemaKinds.inc	\
	StmtNodes.inc	\
	RSCCOptions.inc

RS_SPEC_TABLES :=	\
	RSClangBuiltinEnums.inc	\
	RSDataTypeEnums.inc	\
	RSDataElementEnums.inc	\
	RSDataKindEnums.inc	\
	RSObjectTypeEnums.inc

LOCAL_SRC_FILES :=	\
	llvm-rs-cc.cpp	\
	slang_rs.cpp	\
	slang_rs_context.cpp	\
	slang_rs_pragma_handler.cpp	\
	slang_rs_backend.cpp	\
	slang_rs_exportable.cpp	\
	slang_rs_export_type.cpp	\
	slang_rs_export_element.cpp	\
	slang_rs_export_var.cpp	\
	slang_rs_export_func.cpp	\
	slang_rs_reflection.cpp \
	slang_rs_reflect_utils.cpp

LOCAL_SHARED_LIBRARIES :=      \
	libslang

LOCAL_STATIC_LIBRARIES :=	\
	libclangDriver

# For build RSCCOptions.inc from RSCCOptions.td
intermediates := $(call local-intermediates-dir)
LOCAL_GENERATED_SOURCES += $(intermediates)/RSCCOptions.inc
$(intermediates)/RSCCOptions.inc: $(LOCAL_PATH)/RSCCOptions.td $(CLANG_ROOT_PATH)/include/clang/Driver/OptParser.td $(TBLGEN)
	@echo "Building RenderScript compiler (llvm-rs-cc) Option tables with tblgen"
	$(call transform-host-td-to-out,opt-parser-defs)

include frameworks/compile/slang/RSSpec.mk
include $(CLANG_HOST_BUILD_MK)
include $(CLANG_TBLGEN_RULES_MK)
include $(BUILD_HOST_EXECUTABLE)
