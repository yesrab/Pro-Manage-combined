const fetchUtils = async (reqobj) => {
  try {
    const responce = await fetch(reqobj);
    const data = await responce.json();
    return data;
  } catch (error) {
    return error;
  }
};

export default fetchUtils;
