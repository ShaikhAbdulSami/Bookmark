import React from 'react';
import Styles from './Footer.module.css';

export const Footer = () => {
    return (
        <p className={Styles.footer}>
            <hr />
            <br />
            <p>Powered by Shaikh Enterprises</p>
            <p>Copyright &copy; 2020 Shaikh Enterprises. All Rights Reserved.</p>
            <br />
            <hr />
        </p>
    )
}
export default Footer;