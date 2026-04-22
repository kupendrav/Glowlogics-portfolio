#!/bin/sh
set -eu

if [ -n "${DATABASE_URL:-}" ] && [ -z "${SPRING_DATASOURCE_URL:-}" ]; then
  DB_NO_SCHEME="${DATABASE_URL#postgresql://}"
  DB_HOSTPORT_AND_NAME="${DB_NO_SCHEME#*@}"
  DB_HOSTPORT="${DB_HOSTPORT_AND_NAME%%/*}"
  DB_NAME="${DB_HOSTPORT_AND_NAME#*/}"

  export SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOSTPORT}/${DB_NAME}"
fi

if [ -n "${DB_USER:-}" ] && [ -z "${SPRING_DATASOURCE_USERNAME:-}" ]; then
  export SPRING_DATASOURCE_USERNAME="${DB_USER}"
fi

if [ -n "${DB_PASSWORD:-}" ] && [ -z "${SPRING_DATASOURCE_PASSWORD:-}" ]; then
  export SPRING_DATASOURCE_PASSWORD="${DB_PASSWORD}"
fi

exec java ${JAVA_OPTS:-} -jar /app/app.jar
