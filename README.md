# gpt4-news-processor

Nodejs + postgreSQL backend to summarise Indian news articles using GPT4

Features supported as of 2 jun 2023:
 - read and parse sitemaps of news websites (currently supports only Hindustan Times)
 - categorise based on time posted and category (world-news, entertainment, etc)
 - crawl webpages using Playwright and ARIA selectors to get news content
 - access OpenAI GPT4 API and receive summaries
 - store all content and summaries in PostgreSQL database

## How to run

1. Install dependencies using npm

2. Create and host a PostgreSQL DB

(App is currently tested with DB hosted on Render.com)

3. Add a .env file with the params:

```
DBConnLink=
OPENAI_API_KEY=
```

Example .env file (note these credentials are incorrect):

```
DBConnLink=postgres://me:1JaCdkEuiREpyVkMmMD5qCc6i6xkoOfY@dpg-choth0m7jbva90hsr2eg-a.singapore-postgres.render.com/news_7oav
OPENAI_API_KEY=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
```

4. Run app using `node index.js`

5. Call endpoints defined in `router.js` using Postman or any other HTTP client

(App can be run locally or hosted on a service such as Render)

