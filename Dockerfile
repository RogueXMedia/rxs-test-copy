FROM caddy:2.8-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY public /srv/public
EXPOSE 8080
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
