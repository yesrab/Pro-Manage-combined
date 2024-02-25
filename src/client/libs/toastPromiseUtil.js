function toastPromice(res) {
  const mypromice = new Promise((resolver, reject) => {
    if (res?._id) {
      resolver(res._id);
    }
    if (res?.id) {
      resolver(res.id);
    }
    if (res?.status === "success") {
      resolver(res);
    } else {
      reject("The _id does not exist in the response.");
    }
  });
  return mypromice;
}

export default toastPromice;
