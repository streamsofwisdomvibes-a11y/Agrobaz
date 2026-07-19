import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from './firebase';

// ============ AUTHENTICATION ============

export const authService = {
  // Register new user
  async register(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email: user.email,
        fullName: userData.fullName,
        role: userData.role, // 'buyer', 'seller', 'affiliate'
        businessName: userData.businessName || null,
        affiliateId: userData.affiliateId || null,
        address: userData.address || {},
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { user, success: true };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Sign in user
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, success: true };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Sign out user
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get current user profile from Firestore
  async getCurrentUser(uid) {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      }
      return null;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },
};

// ============ PRODUCTS ============

export const productService = {
  // Create product (seller only)
  async createProduct(productData, sellerId) {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        sellerId,
        createdAt: new Date(),
        updatedAt: new Date(),
        reviews: [],
        status: 'active',
      });
      return { id: docRef.id, success: true };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get all products with optional filtering
  async getProducts(filters = {}) {
    try {
      let q = collection(db, 'products');
      const constraints = [where('status', '==', 'active')];

      if (filters.category) {
        constraints.push(where('category', '==', filters.category));
      }

      if (filters.search) {
        // Note: For better search, consider using Algolia or Meilisearch
        // This is a basic implementation
      }

      q = query(collection(db, 'products'), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get single product
  async getProduct(productId) {
    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Update product (seller only)
  async updateProduct(productId, productData) {
    try {
      const docRef = doc(db, 'products', productId);
      await updateDoc(docRef, {
        ...productData,
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Delete product (seller only)
  async deleteProduct(productId) {
    try {
      const docRef = doc(db, 'products', productId);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get seller's products
  async getSellerProducts(sellerId) {
    try {
      const q = query(collection(db, 'products'), where('sellerId', '==', sellerId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

// ============ ORDERS ============

export const orderService = {
  // Create order (buyer only)
  async createOrder(orderData, buyerId) {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        buyerId,
        status: 'pending',
        paymentStatus: 'unpaid',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create commission record automatically
      const commissionAmount = (orderData.totalAmount * 3.5) / 100;
      await addDoc(collection(db, 'commissions'), {
        userId: orderData.sellerId,
        orderId: docRef.id,
        amount: commissionAmount,
        rate: 3.5,
        type: 'seller-commission',
        status: 'earned',
        createdAt: new Date(),
      });

      return { id: docRef.id, success: true };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get user's orders
  async getUserOrders(userId, role) {
    try {
      let q;
      if (role === 'buyer') {
        q = query(collection(db, 'orders'), where('buyerId', '==', userId));
      } else if (role === 'seller') {
        q = query(collection(db, 'orders'), where('sellerId', '==', userId));
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get single order
  async getOrder(orderId) {
    try {
      const docRef = doc(db, 'orders', orderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Update order status (seller only)
  async updateOrderStatus(orderId, status) {
    try {
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, {
        status,
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

// ============ COMMISSIONS & AFFILIATES ============

export const commissionService = {
  // Get user commissions
  async getUserCommissions(userId) {
    try {
      const q = query(collection(db, 'commissions'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get commission summary
  async getCommissionSummary(userId) {
    try {
      const q = query(collection(db, 'commissions'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const commissions = querySnapshot.docs.map(doc => doc.data());

      const totalEarned = commissions
        .filter(c => c.status === 'earned' || c.status === 'paid')
        .reduce((sum, c) => sum + c.amount, 0);

      const pendingPayout = commissions
        .filter(c => c.status === 'earned')
        .reduce((sum, c) => sum + c.amount, 0);

      return { totalEarned, pendingPayout };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export const affiliateService = {
  // Create affiliate referral
  async createReferral(affiliateId, referralLink) {
    try {
      const docRef = await addDoc(collection(db, 'affiliateReferrals'), {
        affiliateId,
        referralLink,
        status: 'clicked',
        clicks: 0,
        conversionValue: 0,
        commissionEarned: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { id: docRef.id, success: true };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get affiliate's referrals
  async getAffiliateReferrals(affiliateId) {
    try {
      const q = query(
        collection(db, 'affiliateReferrals'),
        where('affiliateId', '==', affiliateId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Track referral click
  async trackReferralClick(referralId) {
    try {
      const docRef = doc(db, 'affiliateReferrals', referralId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const clicks = (docSnap.data().clicks || 0) + 1;
        await updateDoc(docRef, { clicks, updatedAt: new Date() });
        return { success: true };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

// ============ FILE UPLOAD ============

export const storageService = {
  // Upload product image
  async uploadProductImage(file, productId) {
    try {
      const storageRef = ref(storage, `products/${productId}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return { url: downloadURL, success: true };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Upload profile picture
  async uploadProfilePicture(file, userId) {
    try {
      const storageRef = ref(storage, `profiles/${userId}/avatar`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return { url: downloadURL, success: true };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
