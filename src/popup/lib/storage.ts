export type VideoData = {
  title: string
  watched: boolean
  watchedAt?: string
  duration?: number
  plan: string
  creator?: string
}

export type StorageData = {
  videos: Record<string, VideoData>
  learningPlans: Record<string, string[]>
}

const defaultData: StorageData = {
  videos: {},
  learningPlans: {},
}

const YT_API = "AIzaSyDlJY4ue5moCoVSp_nZaJjKdSW-x1YsHcs"

async function fetchVideoDuration(videoId: string): Promise<number | undefined> {
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${YT_API}`
    const res = await fetch(url)
    const data = await res.json()

    const iso = data?.items?.[0]?.contentDetails?.duration
    if (!iso) return undefined

    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return undefined

    const hours = parseInt(match[1] || "0")
    const minutes = parseInt(match[2] || "0")
    const seconds = parseInt(match[3] || "0")

    return hours * 3600 + minutes * 60 + seconds
  } catch (error) {
    console.error("Failed to fetch video duration:", error)
    return undefined
  }
}

async function fetchVideoCreator(videoId: string): Promise<string | undefined> {
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YT_API}`
    const res = await fetch(url)
    const data = await res.json()
    return data?.items?.[0]?.snippet?.channelTitle
  } catch (error) {
    console.error("Failed to fetch video creator:", error)
    return undefined
  }
}

export function getStorage(): Promise<StorageData> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(defaultData, (data) => {
      resolve(data as StorageData)
    })
  })
}

export async function addVideoToPlan(
  id: string,
  title: string,
  plan: string
): Promise<void> {
  const data = await getStorage()

  if (!data.learningPlans[plan]) {
    data.learningPlans[plan] = []
  }

  if (!data.learningPlans[plan].includes(id)) {
    data.learningPlans[plan].push(id)
  }

  const [duration, creator] = await Promise.all([
    fetchVideoDuration(id),
    fetchVideoCreator(id),
  ])

  data.videos[id] = {
    title,
    watched: false,
    plan,
    duration,
    creator,
  }

  return new Promise((resolve) =>
    chrome.storage.sync.set(data, () => resolve())
  )
}

export async function toggleWatched(videoId: string): Promise<void> {
  const data = await getStorage()
  const video = data.videos[videoId]
  if (video) {
    video.watched = !video.watched
    video.watchedAt = video.watched ? new Date().toISOString() : undefined

    return new Promise((resolve) =>
      chrome.storage.sync.set(data, () => resolve())
    )
  }
}

export async function removeVideoFromPlan(videoId: string): Promise<void> {
  const data = await getStorage()
  const video = data.videos[videoId]
  if (!video) return

  const plan = video.plan
  delete data.videos[videoId]
  data.learningPlans[plan] = data.learningPlans[plan].filter((id) => id !== videoId)

  return new Promise((resolve) =>
    chrome.storage.sync.set(data, () => resolve())
  )
}
