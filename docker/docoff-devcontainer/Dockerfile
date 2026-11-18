FROM frontend-devcontainer

# `sudo` is limited to `docker` (access to the host Docker socket, see docker-compose.base.yml)
# and `chown` (used by docker-entrypoint); the Docker socket itself already grants host root,
# so no other commands are allowed
USER root
RUN echo "developer ALL=(root) NOPASSWD: /usr/bin/docker, /usr/bin/chown" > /etc/sudoers.d/developer
USER developer:developer

# Wrapper scripts that execute commands inside the appropriate Docker containers.
# These scripts use Docker-from-Docker to run the commands in the context of the
# respective Docker containers, allowing container agnostic development workflows.

COPY --chmod=+x files/usr/local/bin/node /usr/local/bin/node
COPY --chmod=+x files/usr/local/bin/npm /usr/local/bin/npm
COPY --chmod=+x files/usr/local/bin/npx /usr/local/bin/npx

WORKDIR     /workspace
