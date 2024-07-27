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
} from "firebase/firestore";
const addTransaction = async (transaction) => {
  const senderAddress = transaction.addresses; // Sender's address
  const receiverAddress = transaction.receiverAddress; // Receiver's address

  // Add the current date to the transaction
  const currentDate = new Date().toISOString();
  transaction.date = currentDate;

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
export { addTransaction };

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
