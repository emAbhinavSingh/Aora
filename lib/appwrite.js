import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform : "com.emabhinavsingh.aora",
    projectId: "6708071500194cbd6fca",
    storageId: "67080b3400309d0d2332",
    databaseId:"6708090a000695fbf976",
    userCollectionId: "6708094900149e6f0319",
    videoCollectionId: "6708099700169455ab87",
}

const {
    endpoint,
    platform,
    projectId,
    storageId,
    databaseId,
    userCollectionId,
    videoCollectionId,
} = config

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId) 
    .setPlatform(config.platform)
 
    const account = new Account(client)
    const avatars = new Avatars(client)
    const databases = new Databases(client)
    const storage = new Storage(client)


    // Register user
export const createUser = async(email, password, username) =>{
        try {
            const newAccount = await account.create(
                ID.unique(),
                email,
                password,
                username
            )

            if(!newAccount) throw Error

            const avatarUrl = avatars.getInitials(username)

            await signIn(email,password)

            const newUser = await databases.createDocument(
                config.databaseId,
                config.userCollectionId,
                ID.unique(),
                {
                    accountId: newAccount.$id,
                    email: email,
                    username: username,
                    avatar: avatarUrl,
                }
            )

            return newUser
        } catch (error) {
            console.log(error);
            throw new Error(error)  
        }
    }

    // Sign In
export const signIn = async (email,password) => {
            try {
                const session = await account.createEmailPasswordSession(email,password)
             return session
             } catch (error) {
                throw new Error(error)
     }
}

    // Get Account
export const getAccount = async() => {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
  }

    //   Get Current User
export const getCurrentUser = async() => {
    try {
        const currentAccount = await getAccount()
        if(!currentAccount) throw Error 

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error

        return currentUser.documents[0]
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.orderDesc('$createdAt')]
        )
        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}
export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.orderDesc('$createdAt', Query.limit(7))]
        )
        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}
export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.search('title', query)]
        )
        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}
export const getUSerPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.equal('creator', userId)]
        )
        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}
export const signOut = async () => {
    try {
        const session = await account.deleteSession('current')
    } catch (error) {
        throw new Error(error)
    }
}
export const uploadFile = async (file, type) => {
    if (!file) return;
  
    const asset = {
        name: file.fileName,
        type: file.mineType,
        size: file.fileSize,
        uri: file.uri,
        // uri: platform.OS === 'android' ? 'file://' : '' + capturedImageUri
    }
  
    try {
      const uploadedFile = await storage.createFile(
        config.storageId,
        ID.unique(),
        asset
      );
  
      const fileUrl = await getFilePreview(uploadedFile.$id, type);
      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
}
export const getFilePreview = async (fileId, type) => {
    let fileUrl;
  
    try {
      if (type === "video") {
        fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
      } else if (type === "image") {
        fileUrl = storage.getFilePreview(
          config.storageId,
          fileId,
          2000,
          2000,
          "top",
          100
        );
      } else {
        throw new Error("Invalid file type");
      }
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
}
export const createVideo = async (form) => {
    try {
      const [thumbnailUrl, videoUrl] = await Promise.all([
        uploadFile(form.thumbnail, "image"),
        uploadFile(form.video, "video"),
      ]);
  
      const newPost = await databases.createDocument(
        config.databaseId,
        config.videoCollectionId,
        ID.unique(),
        {
          title: form.title,
          thumbnail: thumbnailUrl,
          video: videoUrl,
          prompt: form.prompt,
          creator: form.userId,
        }
      );
  
      return newPost;
    } catch (error) {
      throw new Error(error);
    }
}