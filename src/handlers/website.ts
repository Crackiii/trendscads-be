import { Cluster } from "puppeteer-cluster";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import {Page} from "puppeteer";

const getWebsiteDataByLink = async (links: string[]) => {
  console.log("[Website]: Getting website data by link", links[0]);
  try {
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 50,
      monitor: false,
      timeout: 30000,
      puppeteerOptions: {
        headless: true,
        defaultViewport: null,
        args: [
          "--lang=en-US",
          "--window-size=1920,1080",
          "--no-sandbox",
        ]
      }
    });
  
    const websiteData: Record<string, unknown>[] = [];
    const errors: string[] = [];

    cluster.on("taskerror", (err, data) => {
      errors.push(`Error in getWebsiteDataByLink() - ${data}: ${err.message}`);
    });

    await cluster.task(async ({ page, data: url }) => {
      if (!Boolean(url)) return;

      await page.setExtraHTTPHeaders({
        "Accept-Language": "en-US"
      });

      await page.goto(url, { waitUntil: "load", timeout: 0 });
      const data = await evaluateGeneralWebsite(page);

      websiteData.push(data);
    });

    for (const url of links) cluster.queue(url);

    await cluster.idle();
    await cluster.close();

    return {websiteData, errors};
  } catch (error) {
    console.log({error: error.message});
    return new Error(`Error in getWebsiteDataByLink(): ${error.message}`);
  }
};

const evaluateGeneralWebsite = async (page: Page) => {

  const data = await page.evaluate(() => {
    return document.body.outerHTML;
  });

  const metaData = await getPageMetaData(page);
  await page.close();
  const doc = new JSDOM(data);
  const reader = new Readability(doc.window.document);

  return { html: reader.parse()?.textContent, metaData };
};

const getPageMetaData = async (page: Page) => {
  const metaData = await page.evaluate(() => {
    const metas = Array.from(document.querySelectorAll("meta"));

    const title = document.title;

    const validURL = (str: string) => {
      const pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$", "i"); // fragment locator

      return !!pattern.test(str);
    };

    const url = location.href;

    const keywords = metas
      .filter(meta => meta?.getAttribute("name") === "keywords")
      .map(meta => meta?.getAttribute("content")).join(",");


    const facebook = metas
      .filter(meta => /og:/gmi.test(meta?.getAttribute("property")))
      .map(meta => ({
        property: meta?.getAttribute("property"),
        content: meta?.getAttribute("content")
      }));

    const twitter = metas
      .filter(meta => /twitter:/gmi.test(meta?.getAttribute("name")))
      .map(meta => ({
        property: meta?.getAttribute("name"),
        content: meta?.getAttribute("content")
      }));

    const images = [...facebook.filter(o => o.property === "og:image" || /image/gmi.test(o.property)),
    ...twitter.filter(o => (o.property === "twitter:image" || /image/gmi.test(o.property)))
    ].map(o => o?.content).filter(validURL);

    return { title, keywords, facebook, twitter, images, url };
  });

  return metaData;
};



export const websiteHandler = async (url: string) => {
  const data  = await getWebsiteDataByLink([url]);

  return data;
};