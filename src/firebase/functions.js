// firebase/transactions.js
import { db } from "@/firebase/config";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  addDoc,
  getDocs,
  query,
  arrayRemove,
} from "firebase/firestore";
const addTransaction = async (transaction) => {
  const senderAddress = transaction.addresses; // Sender's address
  const receiverAddress = transaction.receiverAddress; // Receiver's address

  // Helper function to add transaction to an address
  const addTransactionToAddress = async (address, transaction, type) => {
    const docRef = doc(db, "transactions", address);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // If the document exists, update the transactions array
      await updateDoc(docRef, {
        transactions: arrayUnion({ ...transaction, type }),
      });
    } else {
      // If the document does not exist, create it
      await setDoc(docRef, {
        address,
        transactions: [{ ...transaction, type }],
      });
    }
  };

  try {
    // Add transaction for sender
    await addTransactionToAddress(senderAddress, transaction, "sent");

    // Create a transaction object for the receiver
    const receiverTransaction = {
      ...transaction,
      type: "received",
      activity: `received token from ${senderAddress}`,
      addresses: receiverAddress,
      receiverAddress: senderAddress,
    };

    // Add transaction for receiver
    await addTransactionToAddress(
      receiverAddress,
      receiverTransaction,
      "received"
    );

    console.log("Transaction successfully added!");
  } catch (e) {
    console.error("Error adding transaction: ", e);
  }
};

const burnToken = async (address, transaction) => {
  const addTransactionToAddress = async (address, transaction, type) => {
    const docRef = doc(db, "transactions", address);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // If the document exists, update the transactions array
      await updateDoc(docRef, {
        transactions: arrayUnion({ ...transaction, type }),
      });
    } else {
      // If the document does not exist, create it
      await setDoc(docRef, {
        address,
        transactions: [{ ...transaction, type }],
      });
    }
  };
  addTransactionToAddress(address, transaction, "burned");
};
export { addTransaction, burnToken };

export const uploadData = async (sampleData) => {
  try {
    const address = sampleData[0].addresses; // Assuming the address is the same for all transactions
    const structuredData = {
      address: address,
      transactions: sampleData,
    };

    await addDoc(collection(db, "transactions"), structuredData);
    console.log("Document successfully written!");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const fetchAdminTable = async (setLoading, setError) => {
  try {
    setLoading(true);
    const q = query(collection(db, "transactions"));
    const querySnapshot = await getDocs(q);
    const fetchedData = querySnapshot.docs.map((doc) => doc.data());

    // Flatten and sort data client-side
    const allTransactions = fetchedData.flatMap((doc) => doc.address);
    const transformedTransactions = allTransactions.map((address, index) => ({
      index,
      address,
    }));
    console.log(transformedTransactions);

    // Filter transactions based on the type and search query
    // const filteredData = allTransactions.filter((tx) => {
    //   const matchesType = active === "all" || tx.type === active;
    //   const matchesSearchQuery =
    //     tx.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     tx.addresses.toLowerCase().includes(searchQuery.toLowerCase());

    //   return matchesType && matchesSearchQuery;
    // });

    // // Function to parse date strings into Date objects
    // const parseDate = (dateString) => new Date(dateString);

    // // Sort transactions by the `date` field in descending order
    // const sortedData = filteredData.sort((a, b) => {
    //   const aDate = parseDate(a.date);
    //   const bDate = parseDate(b.date);
    //   return bDate - aDate; // Descending order
    // });
    // console.log(sortedData)
    //   return sortedData;
    return transformedTransactions;
  } catch (error) {
    setError("Error fetching document: " + e.message);
    console.error(error);
  } finally {
    setLoading(false);
  }
};

export async function addDelegateViewer(newString) {
  const userRef = doc(db, "delegateViewers", "addresses");

  try {
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const currentArray = docSnap.data().address || [];

      if (!currentArray.includes(newString)) {
        await updateDoc(userRef, {
          address: arrayUnion(newString),
        });
        console.log("String added!");
      } else {
        console.log("String already exists in the array.");
      }
    } else {
      console.log("No such document! Creating a new one.");
      await setDoc(userRef, { address: [newString] });
      console.log("Document created and string added!");
    }
  } catch (error) {
    console.error("Error adding string: ", error);
  }
}
export async function removeDelegateViewer(stringToRemove) {
  const userRef = doc(db, "delegateViewers", "addresses");

  try {
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const currentArray = docSnap.data().address || [];

      if (currentArray.includes(stringToRemove)) {
        await updateDoc(userRef, {
          address: arrayRemove(stringToRemove),
        });
        console.log("String removed!");
      } else {
        console.log("String does not exist in the array.");
      }
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error removing string: ", error);
  }
}

export async function getDelegateViewers(setLoading, setError) {
  const userRef = doc(db, "delegateViewers", "addresses");
  setLoading(true);
  try {
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const currentArray = docSnap.data().address || [];
      console.log("Current Array:", currentArray);
      const returnValue = currentArray.map((address) => ({
        address,
      }));
      console.log(returnValue);
      return returnValue;
    } else {
      console.log("No such document!");
      return [];
    }
  } catch (error) {
    console.error("Error getting array: ", error);
    setError("Error fetching document: " + e.message);
    return [];
  } finally {
    setLoading(false);
  }
}
