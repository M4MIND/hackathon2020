FROM node:15

ENV USERNM=runner
ENV UID=16161
ENV GID=16161
ENV WORKDIR="/app"

RUN mkdir -p "$WORKDIR"                      && \
#    addgroup --gid "$GID" --system "$USERNM" && \
    adduser --disabled-password                 \
            --gecos ""                          \
            --home "$WORKDIR"                   \
            --no-create-home                    \
            --uid "$UID"                        \
#            --ingroup "$USERNM"                 \
#            --gid "$GID"                        \
            --group                             \
            --system "$USERNM"               && \
    chown -R "$UID:$GID" "$WORKDIR"          && \
    echo "User created"                         

WORKDIR "${WORKDIR}"

RUN apt-get update \
    # Install latest chrome dev package, which installs the necessary libs to # make the bundled version of Chromium that Puppeteer installs work. && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
#    && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
#    && chmod +x /usr/sbin/wait-for-it.sh \
    && echo "Chrome devs installed"

COPY ./package.json /app/
COPY ./package-lock.json /app/
RUN yarn install

COPY . /app
RUN ["yarn", "build"]

RUN chown -R "$UID:$GID" "$WORKDIR"
USER "$USERNM":"${USERNM}"

EXPOSE 3000

CMD ["yarn", "start"]
