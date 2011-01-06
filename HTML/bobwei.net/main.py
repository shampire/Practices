#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import cgi

from google.appengine.api import urlfetch
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
from google.appengine.api import memcache


class SlidesControlHandler(webapp.RequestHandler):
  def get(self):
    currentSlide = memcache.get("currentSlide")
    if currentSlide is not None:
      self.response.out.write(currentSlide)
    else:
      self.response.out.write(1)    
    #self.response.out.write('a = '+str(self.a))

class setCurrentSlide(webapp.RequestHandler):
  def get(self):
    currentSlide = cgi.escape(self.request.get('currentSlide'))
    pwd = cgi.escape(self.request.get('pwd'))
    #self.response.out.write('currentSlide:' + currentSlide)
    #self.response.out.write('pwd:' + pwd)
    myPwd = 'helloworld'
    if pwd == myPwd:
      memcache.flush_all()
      memcache.add("currentSlide", currentSlide, time=3600)
      self.response.out.write('success')

class getBeautyList(webapp.RequestHandler):
  def get(self):
    url = "http://testforbabyupload.appspot.com/Query"
    result = urlfetch.fetch(url)
    if result.status_code == 200:
      self.response.out.write(result.content)
    else:
      self.response.out.write('error status code: ' + result.content)

def main():
  application = webapp.WSGIApplication([('/slidesControl', SlidesControlHandler), 
('/setCurrentSlide', setCurrentSlide), ('/getBeautyList', getBeautyList)],
                                       debug=True)
  util.run_wsgi_app(application)


if __name__ == '__main__':
  main()
