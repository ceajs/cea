FROM ubuntu:latest
ENV TZ="Asia/Shanghai"
WORKDIR /cea
COPY ./cea-cron ./
RUN export DEBIAN_FRONTEND=noninteractive \
    && apt-get update \
    && apt-get install -yq cron tzdata curl \
    && ln -fs /usr/share/zoneinfo/$TZ /etc/localtime  \
    && dpkg-reconfigure -f noninteractive tzdata \
    && curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs \
    && apt-get install -y postfix \
    && crontab ./cea-cron \
    && npm install -g cea \
    && apt-get clean \
    && rm -rf \
    "/tmp/!(conf)" \
    /usr/share/doc/* \
    /var/cache/* \
    /var/lib/apt/lists/* \
    /var/tmp/*
CMD postfix start && cron -f
