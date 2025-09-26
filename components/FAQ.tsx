import React from 'react';
import { ArrowLeftIcon } from './icons';

interface FAQProps {
    onBack: () => void;
}

const FAQItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => (
    <div className="border-b border-border-color py-4">
        <h3 className="text-xl font-semibold text-primary mb-2">{question}</h3>
        <div className="text-text-secondary">{children}</div>
    </div>
);


const FAQ: React.FC<FAQProps> = ({ onBack }) => {
    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-2 mb-6 text-primary hover:text-primary/80 font-semibold">
                <ArrowLeftIcon className="h-5 w-5" />
                Back
            </button>
            <div className="bg-card rounded-lg shadow-lg p-6 md:p-8">
                 <h2 className="text-3xl font-bold mb-4 text-card-foreground">Frequently Asked Questions</h2>
                 <div className="space-y-4">
                    <FAQItem question="What is Q-Free?">
                        <p>Q-Free is an intelligent queue management system designed to eliminate physical lines and provide accurate wait time predictions using AI. It helps businesses improve customer flow and enhances the customer experience.</p>
                    </FAQItem>
                    <FAQItem question="How accurate are the wait time predictions?">
                        <p>Our AI model analyzes historical data, current queue length, and average service times to provide highly accurate predictions. While predictions are not guaranteed, they offer a reliable estimate to help you plan your time.</p>
                    </FAQItem>
                     <FAQItem question="Do I need to install an app to use Q-Free as a customer?">
                        <p>No, our system is web-based. You can join a queue and monitor your status directly from your web browser on any device.</p>
                    </FAQItem>
                     <FAQItem question="Is my data secure?">
                        <p>Yes, we prioritize data security and privacy. All data is encrypted, and we follow industry best practices to protect user information.</p>
                    </FAQItem>
                 </div>
            </div>
        </div>
    );
};

export default FAQ;