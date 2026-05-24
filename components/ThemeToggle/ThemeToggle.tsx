'use client'

import { useState, useEffect } from 'react'
import { SunIcon, MoonIcon } from '../icons/UIIcons'
import styles from './ThemeToggle.module.scss'

type Theme = 'light' | 'dark'

export default function ThemeToggle(){
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(()=>{
        const storedTheme = localStorage.getItem('theme') as Theme | null
        if(storedTheme){
            setTheme(storedTheme)
            updateDocumentAttribute(storedTheme)
        }
    }, [])

    const updateDocumentAttribute = (theme: Theme) =>{
        document.documentElement.setAttribute('data-theme', theme)
    }

    const toggleTheme = () =>{
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        updateDocumentAttribute(newTheme)
        localStorage.setItem('theme', newTheme)
    }

    return (
        <button className={styles.toggleBtn} type="button" onClick={toggleTheme} aria-label="Toggle theme">{theme === 'dark' ? <SunIcon/> : <MoonIcon/>}</button>
    )
}