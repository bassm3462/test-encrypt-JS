FROM node:21.1.0 
WORKDIR /ENCRYPTANDDECRYPT
COPY package.json .
# ARG NODE_ENV
# RUN if("NODE_ENV"="PRODUCTION")\
#  then npm install --only=PRODUCTION \
#  else npm install ; fi

RUN npm install 
COPY . .
EXPOSE 4000
CMD ["npm","run","dev"]

# FROM node:21.1.0 as production
# WORKDIR /ENCRYPTANDDECRYPT
# COPY package.json .
# ARG NODE_ENV
# # RUN if("NODE_ENV"="PRODUCTION")\
# #  then npm install --only=PRODUCTION \
# #  else npm install ; fi

# RUN npm install --only = production
# COPY . .
# EXPOSE 4000
# CMD ["npm","start"]