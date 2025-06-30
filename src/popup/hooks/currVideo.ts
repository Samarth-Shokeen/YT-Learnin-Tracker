export async function getCurrentVideoInfo() {
  return new Promise<{
    videoId: string
    title: string
    url: string
  }>((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0]
      const url = new URL(tab?.url || "")
      const videoId = url.searchParams.get("v") || ""
      const title = tab?.title?.replace(" - YouTube", "") || ""
      resolve({ videoId, title, url: tab?.url || "" })
    })
  })
}
