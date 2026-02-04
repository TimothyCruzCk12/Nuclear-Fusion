import React, { useState, useEffect, useRef } from 'react';

// UI Components Imports
import { Container } from './ui/reused-ui/Container.jsx'
import { GlowButton } from './ui/reused-ui/GlowButton.jsx'

// UI Animation Imports
import './ui/reused-animations/fade.css';
import './ui/reused-animations/scale.css';
import './ui/reused-animations/glow.css';


const NuclearFusion = () => {
        // State Management

        const [showStep1, setShowStep1] = useState(false);
        
        const handleReset = () => {
                setShowStep1(false);
        }

        // Functions
        const handleBeginClick = () => {
                setShowStep1(true);
        }


	return (
                <Container text="Nuclear Fusion" showResetButton={true} onReset={handleReset} contentDark={showStep1}>
                        {!showStep1 && (
                                <div className="w-full h-full flex justify-center items-center">
                                        <GlowButton text="Begin Interactive" autoShrinkOnClick={true}
                                        onClick={handleBeginClick}>
                                                Begin Interactive
                                        </GlowButton>
                                </div>
                        )}
                </Container>
        )
};


export default NuclearFusion;