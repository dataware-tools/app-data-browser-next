#!/usr/bin/env sh
#
# Entrypoint for a container
#

# Fix Auth0's configurations
[[ -z "${DATAWARE_TOOLS_AUTH_CONFIG_DOMAIN}" ]] &&
  DATAWARE_TOOLS_AUTH_CONFIG_DOMAIN="dataware-tools.us.auth0.com"
[[ -z "${DATAWARE_TOOLS_AUTH_CONFIG_CLIENT_ID}" ]] &&
  DATAWARE_TOOLS_AUTH_CONFIG_CLIENT_ID="ETb1RhJEbtXlFgWtaHzl5kPCkaYqhTVl"
[[ -z "${DATAWARE_TOOLS_AUTH_CONFIG_API_URL}" ]] &&
  DATAWARE_TOOLS_AUTH_CONFIG_API_URL="https://demo.dataware-tools.com/"

sed -i -e "s/ETb1RhJEbtXlFgWtaHzl5kPCkaYqhTVl/${DATAWARE_TOOLS_AUTH_CONFIG_CLIENT_ID}/g" /app/dist/*/*/*.js
sed -i -e "s/dataware-tools.us.auth0.com/${DATAWARE_TOOLS_AUTH_CONFIG_DOMAIN}/g" /app/dist/*/*/*.js
sed -i -e "s|https://demo.dataware-tools.com/|${DATAWARE_TOOLS_AUTH_CONFIG_API_URL}|g" /app/dist/*/*/*.js

exec "$@"
