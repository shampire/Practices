#**********************************************************************
#*                      Sploit Mutation Engine                        *
#**********************************************************************
#* Copyright (C) 2004-2007 Davide Balzarotti                          *
#*                                                                    *
#* This program is free software; you can redistribute it and/or      *
#* modify it under the terms of the GNU General Public License        *
#* version 2.                                                         *
#*                                                                    *
#* This program is distributed in the hope that it will be useful,    *
#* but WITHOUT ANY WARRANTY; without even the implied warranty of     *
#* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.               *
#* See the GNU General Public License for more details.               *
#*                                                                    *
#* You should have received a copy of the GNU General Public License  *
#* along with this program; if not, write to the Free Software        *
#* Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.          *
#*********************************************************************/

# Author: Davide Balzarotti
# $Id: __init__.py 109 2006-02-27 20:17:42Z balzarot $

"""
	Package Operators
	This package contains all the mutant operators.
	Actually, the operators are placed in sub-packages depending on the
	layer they operate.
"""

__all__ = [ 
		  	"eth-layer",
			"ip-layer",
			"tcp-layer",
			"ftp-layer",
			"imap-layer",
			"http-layer",
			"egg-layer",
			"exploit-layer"
		  ]