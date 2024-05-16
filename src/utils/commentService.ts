import { DocumentData, Timestamp, doc, increment, updateDoc, getDoc,arrayUnion } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

export const addComment = async (id: string, data: DocumentData, imageFile: File | null) => {
  let imageUrl = "";

  if (imageFile) {
    const imageref = ref(
      storage,
      `Documents/${imageFile.name.toLocaleLowerCase().split(" ").join("-")}`
    );
    const uploadTask = uploadBytesResumable(imageref, imageFile);
    await uploadTask;
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    console.log("Download URL:", downloadURL);
    imageUrl = downloadURL;
  }

  const colRef = doc(db, "Comments", id);
  // Get the existing comments array from the document
  const existingData = (await getDoc(colRef)).data();
  const existingComments = existingData?.comments || [];

  // Construct the new comment object
  const newComment = {
    ...data,
    imageUrl,
    createdAt: Timestamp.now(),
  };

  const updatedComments = [...existingComments, newComment];

  return await updateDoc(colRef, {
    comments: updatedComments,
  });
};
export const addLikes = async (id: string, address: string) => {
  const docRef = doc(db, "Likes", id);

  return await updateDoc(docRef, {
    likes: increment(1),
    users: arrayUnion({ address: address.toLowerCase(), liked: true }),
  });
};

export const disLikes = async (id: string, address: string) => {
  const docRef = doc(db, "Likes", id);

  return await updateDoc(docRef, {
    dislikes: increment(1),
    users: arrayUnion({ address: address.toLowerCase(), liked: false }),
  });
};
