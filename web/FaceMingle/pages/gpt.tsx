// pages/index.js
import Head from 'next/head';
import styles from './index.module.css';
import { useState } from 'react';

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = () => {
      setIsModalOpen(true);
    }
  
    const handleModalClose = () => {
      setIsModalOpen(false);
    }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>RapidLoad</title>
      </Head>
      
      <header className={styles.header}>
        <h1>RapidLoad</h1>
        <nav>
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Documentation</a>
          <a href="#">Support</a>
          <a href="#">Sign in</a>
        </nav>
      </header>

      <main className={styles.main}>
        <h2>Unlock Breakneck PageSpeed</h2>
        <p>Don’t waste money on multiple optimization tools - get everything under one roof.</p>
        <input type="text" placeholder="Enter your website..." />
        <button onClick={handleModalOpen}>Show me my results</button>

      </main>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.closeModal} onClick={handleModalClose}>X</button>
            <h2>Your Results</h2>
            {/* Your modal content goes here */}
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <div>
          <h3>CSS Delivery</h3>
        </div>
        <div>
          <h3>JS Delivery</h3>
        </div>
        <div>
          <h3>Image Delivery</h3>
        </div>
        <div>
          <h3>Font Delivery</h3>
        </div>
        <div>
          <h3>CDN</h3>
        </div>
        <div>
          <h3>Cache Delivery</h3>
        </div>
      </footer>
    </div>
  )
}

