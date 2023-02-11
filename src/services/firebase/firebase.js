import { firebaseConfig } from "./settings";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  getBytes,
} from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Functions to create and update profile
export async function getUserByUid(uid) {
  try {
    const usersRef = collection(db, "users");
    const docRef = doc(usersRef, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const doc = docSnap.data();
      return doc;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function existUsername(username) {
  const users = [];

  const docsRef = collection(db, "users");
  const q = query(docsRef, where("username", "==", username));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    users.push(doc.data());
  });
  return users.length > 0 ? users[0].uid : false;
}

export async function createUser(uid, user) {
  try {
    const collectionRef = collection(db, "users");
    const docref = doc(collectionRef, uid);
    const res = await setDoc(docref, user);
    return res;
  } catch (error) {
    console.error(error);
  }
}

export async function updateUser(uid, user) {
  try {
    const collectionRef = collection(db, "users");
    const docref = doc(collectionRef, uid);
    setDoc(docref, user);
  } catch (error) {
    alert("hola");
  }
}

export async function setUserProfilePhoto(id, file) {
  try {
    const profilePhotoRef = ref(storage, `images/profile/${id}`);
    const resUpload = await uploadBytes(profilePhotoRef, file);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function downloadUserProfilePhoto(id) {
  try {
    const profilePhotoRef = ref(storage, `images/profile/${id}`);
    const resDownload = await getDownloadURL(profilePhotoRef);
    return resDownload;
  } catch (error) {
    console.error(error);
  }
}

// Functions to posts
export async function getPostById(id) {
  try {
    const collectionRef = collection(db, "posts");
    const docRef = doc(collectionRef, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const doc = docSnap.data();
      return doc;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function createPost(id, post) {
  try {
    const collectionRef = collection(db, "posts");
    const docRef = doc(collectionRef, id);
    const res = await setDoc(docRef, post);
    return res;
  } catch (error) {
    console.error(error);
  }
}

export async function setPostPhoto(id, file) {
  try {
    const postPhotoRef = ref(storage, `images/posts/${id}`);
    const resUpload = await uploadBytes(postPhotoRef, file);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function downloadPostPhoto(id) {
  try {
    const postPhotoRef = ref(storage, `images/posts/${id}`);
    const resDownload = await getDownloadURL(postPhotoRef);
    return resDownload;
  } catch (error) {
    console.error(error);
  }
}

export async function getPosts() {
  try {
    const posts = [];
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
      posts.push(doc.data());
    });
    return posts;
  } catch (error) {
    console.error(error);
  }
}

/* Functions to update public/listUsernameAndPhotoURL doc */
export async function updateListUsernameAndPhotoURL(listUsernameAndPhotoURL) {
  try {
    const collectionRef = collection(db, "public");
    const docRef = doc(collectionRef, "listUsernameAndPhotoURL");
    const res = await setDoc(docRef, listUsernameAndPhotoURL);
    return res;
  } catch (error) {
    console.error(error);
  }
}

export async function getListUsernameAndPhotoURL() {
  try {
    const collectionRef = collection(db, "public");
    const docRef = doc(collectionRef, "listUsernameAndPhotoURL");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const doc = docSnap.data();
      return doc;
    } else {
      console.log("hola");
      return {};
    }
  } catch (error) {
    console.error(error);
  }
}

// Batched firestore Function to create all necessary user data
export async function createUserAllData(userUid, user) {
  try {
    // Get a new write batch
    const batch = writeBatch(db);

    // create a new user doc
    const userRef = doc(db, "users", userUid);
    batch.set(userRef, user);

    // Update public/listUsernameAndPhotoURL doc
    const listUsernameAndPhotoURLRef = doc(
      db,
      "public",
      "listUsernameAndPhotoURL"
    );
    batch.update(listUsernameAndPhotoURLRef, {
      [userUid]: {
        username: user.username,
        photoURL: user.photoURL,
      },
    });

    // create a new user liked posts doc
    const userLikedPostsRef = doc(db, "user-liked-posts", userUid);
    batch.set(userLikedPostsRef, {});

    // Commit the batch
    await batch.commit();
  } catch (error) {
    console.error(error.message);
  }
}

// Batched firestore Function to update realted user docs
export async function updateUserAllData(userUid, user) {
  try {
    // Get a new write batch
    const batch = writeBatch(db);

    // create a new user doc
    const userRef = doc(db, "users", userUid);
    batch.set(userRef, user);

    // Update public/listUsernameAndPhotoURL doc
    const listUsernameAndPhotoURLRef = doc(
      db,
      "public",
      "listUsernameAndPhotoURL"
    );
    batch.update(listUsernameAndPhotoURLRef, {
      [userUid]: {
        username: user.username,
        photoURL: user.photoURL,
      },
    });

    // Commit the batch
    await batch.commit();
  } catch (error) {
    console.error(error.message);
  }
}

// Batched firestore Function to add all related post data when user create a post
export async function createPostAllData(postId, post) {
  try {
    // Get a new write batch
    const batch = writeBatch(db);

    // Set the post-like-list of selected post
    const postLikesRef = doc(db, "post-like-list", postId);
    batch.set(postLikesRef, {});

    // Update the count with the selected post
    const countRef = doc(db, "post-like-list", "count");
    batch.update(countRef, { [postId]: 0 });

    // Create new post doc in posts collection
    const postRef = doc(db, "posts", postId);
    batch.set(postRef, post);

    // Commit the batch
    await batch.commit();
  } catch (error) {
    console.error(error.message);
  }
}
