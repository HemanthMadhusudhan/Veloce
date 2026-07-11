FROM alpine:latest

# Install ca-certificates, curl, and unzip
RUN apk add --no-cache ca-certificates curl unzip

# Download and install PocketBase (renaming it to Supabase)
ENV PB_VERSION=0.39.5
RUN curl -L https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip -o /tmp/pb.zip \
    && unzip /tmp/pb.zip -d /pb/ \
    && rm /tmp/pb.zip \
    && mv /pb/pocketbase /pb/supabase

# Copy migrations
COPY ./pb_migrations /pb/pb_migrations

# Expose port
EXPOSE 8080

# Start Supabase
CMD ["/pb/supabase", "serve", "--http=0.0.0.0:8080"]
