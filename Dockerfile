FROM node

ADD package.json /tmp/package.json
RUN cd /tmp && npm install

RUN mkdir -p /opt/backends && cp -a /tmp/node_modules /opt/backends

WORKDIR /opt/backends
COPY . /opt/backends

EXPOSE 3000
CMD npm start