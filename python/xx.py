from BeautifulSoup import BeautifulSoup
file = open('/Users/kordan/Practices/python/re_test.txt', 'r')
content = file.read()
soup = BeautifulSoup(content)
for tag in soup.findAll('a', href=True):
        print tag['href']
