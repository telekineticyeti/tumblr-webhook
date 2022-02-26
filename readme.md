# Tumblr Webhook

Deploy a webhook that will resolve and download image files for the given post URL.

## Accessing the webhook

Make a `POST` request to the endpoint using Postman / IFTTT / Zapier etc. Content type should be `application/json`. The JSON body object should contain a `url` property, with the target post as the value. Example:

```JSON
{
  "url":"URL_OF_THE_TUMBLR_POST"
}
```

## Usage

### Build and run with NodeJS

Place a `.env` file in the repository directory that contains your configured variables in `key=value` format.

```bash
port=8080 # The port that the webhook server should use (optional, defaults to 8080)
consumer_key=YOUR-TUMBLR-CONSUMER-KEY
consumer_secret=YOUR-TUMBLR-CONSUMER-SECRET
token=YOUR-TUMBLR-TOKEN
token_secret=YOUR-TUMBLR-TOKEN-SECRET
```

Install dependencies and deploy:

```bash
# Install dependencies
$ npm install

# Run the development server
$ npm run start

# Run the webhook server
$ npm run deploy
```

### Docker

#### Building the Docker image

```bash
$ docker build . -t webhooks-tumblr
```

#### Running the Docker image

Environment variable configuration is provided via `-e` flags in docker create command.

```docker
docker create \
 --name=webhooks-tumblr \
 -e port=8080 `# The port that the internal webserver should use (optional, defaults to 8080)` \
 -e consumer_key=YOUR-TUMBLR-CONSUMER-KEY \
 -e consumer_secret=YOUR-TUMBLR-CONSUMER-SECRET \
 -e token=YOUR-TUMBLR-TOKEN \
 -e token_secret=YOUR-TUMBLR-TOKEN-SECRET \
 -v ./downloads:/usr/src/app/downloads `# Location of downloaded media files` \
 -p 8080:8080/tcp `# Http` \
 --restart unless-stopped \
 webhooks-tumblr
```

### Docker Compose

Environment variable configuration provided yaml environment list.

```yaml
---
version: '2'
services:
  webhooks-tumblr:
    image: webhooks-tumblr
    container_name: webhooks-tumblr
    restart: unless-stopped
    environment:
      - port # The port that the internal webserver should use (optional, defaults to 8080)
      - consumer_key=YOUR-TUMBLR-CONSUMER-KEY
      - consumer_secret=YOUR-TUMBLR-CONSUMER-SECRET
      - token=YOUR-TUMBLR-TOKEN
      - token_secret=YOUR-TUMBLR-TOKEN-SECRET
    volumes:
      - ./downloads:/usr/src/app/downloads # Location of downloaded media files
    ports:
      - 8080:8080/tcp # Webhook endpoint
```
