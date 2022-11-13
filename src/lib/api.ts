const api = async (...args: Parameters<typeof fetch>) => {
  if (!args[1]) args[1] = {}
  args[0] = `https://${import.meta.env.ENDPOINT}/api/v1/${args[0]}`
  args[1].headers = {
    "Authorization": `Bearer ${import.meta.env.AUTH}`
  }

  try {
    let response = await fetch(...args);
    let text = await response.text();
    try {
      if (text === null) {
        return { error: "Not found" };
      }
      return JSON.parse(text);
    } catch (e) {
      console.error(e);
      return { error: e };
    }
  } catch (error) {
    return { error };
  }
}

export default api;