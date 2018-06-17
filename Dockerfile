# docker build -t kellenschmidt/interactive-resume-and-url-shortener .
# OR (to include custom build number)
# docker build --build-arg APP_VERSION=v1 -t kellenschmidt/interactive-resume-and-url-shortener .
# docker run -p 80:80 -d kellenschmidt/interactive-resume-and-url-shortener

FROM node:9 as builder
ARG APP_VERSION
RUN mkdir /angular
WORKDIR /angular
ENV PATH /angular/node_modules/.bin:$PATH
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
RUN npm install --silent
COPY . .
RUN mv ./src/kellen-mdb-free.scss ./node_modules/angular-bootstrap-md/scss
RUN npm run version -- $APP_VERSION
RUN ng build --prod --no-progress

FROM httpd:2.4-alpine
COPY httpd.conf /home/httpd.conf
RUN cat /home/httpd.conf >> /usr/local/apache2/conf/httpd.conf
COPY --from=builder /angular/dist/interactive-resume-and-url-shortener /usr/local/apache2/htdocs
EXPOSE 80
CMD ["apachectl", "start", "-DFOREGROUND"]
