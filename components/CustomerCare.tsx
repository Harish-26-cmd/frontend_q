
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { ArrowLeftIcon, SendIcon, LocationPinIcon, MailIcon, PhoneIcon } from './icons';

interface CustomerCareProps {
    onBack: () => void;
}

interface Message {
    text: string;
    sender: 'user' | 'bot';
}

const ContactInfoItem: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            <p className="text-text-secondary">{children}</p>
        </div>
    </div>
);

const CustomerCare: React.FC<CustomerCareProps> = ({ onBack }) => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: "Hello! I'm the Q-Free support bot. How can I help you today?" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        // Initialize the AI chat instance
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: 'You are a friendly and helpful customer support bot for Q-Free, an AI-powered queue management system. Your goal is to assist users with their questions about the service. Keep your answers concise and easy to understand.',
                },
            });
        } catch (error) {
            console.error("Failed to initialize AI Chat:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later." }]);
        }
    }, []);

    useEffect(() => {
        // Scroll to the latest message
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (userInput.trim() === '' || isLoading || !chatRef.current) return;

        const userMessage: Message = { text: userInput, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await chatRef.current.sendMessage({ message: userInput });
            const botMessage: Message = { text: response.text, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message to AI:", error);
            const errorMessage: Message = { text: "I'm sorry, I encountered an error. Please try asking again.", sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log('Contact form submitted:', formData);
        // Simulate API call
        await new Promise(res => setTimeout(res, 1500));
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 5000); // Reset submitted state after 5s
    };

    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-2 mb-6 text-primary hover:text-primary/80 font-semibold">
                <ArrowLeftIcon className="h-5 w-5" />
                Back
            </button>
            <div className="bg-card rounded-xl shadow-lg w-full h-[70vh] flex flex-col">
                <div className="p-4 border-b border-border-color">
                    <h2 className="text-xl font-bold text-card-foreground text-center">AI Support Chat</h2>
                </div>

                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                                msg.sender === 'user' 
                                ? 'bg-primary text-primary-foreground rounded-br-lg' 
                                : 'bg-background dark:bg-slate-700 text-text-primary dark:text-slate-100 rounded-bl-lg'
                            }`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="max-w-xs px-4 py-2 rounded-2xl bg-background dark:bg-slate-700 text-text-primary dark:text-slate-100 rounded-bl-lg">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-text-secondary rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-border-color">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Type your message..."
                            className="w-full bg-background dark:bg-slate-700 border border-border-color rounded-lg p-2.5 text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || userInput.trim() === ''}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold p-2.5 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            aria-label="Send message"
                        >
                            <SendIcon className="h-6 w-6" />
                        </button>
                    </form>
                </div>
            </div>

            <div className="my-12 pt-12 border-t border-border-color">
              <div className="bg-card rounded-2xl shadow-xl p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Side: Contact Info */}
                    <div className="flex flex-col justify-center">
                        <h2 className="text-4xl font-extrabold text-text-primary mb-4">Get In Touch</h2>
                        <p className="text-lg text-text-secondary mb-8">
                            For more specific questions, please use the form to contact our team directly. We'd love to hear from you!
                        </p>
                        <div className="space-y-8">
                            <ContactInfoItem icon={<LocationPinIcon className="w-6 h-6" />} title="Our Office">
                                123 Innovation Drive, Tech Park, <br />
                                Metropolis, 54321
                            </ContactInfoItem>
                            <ContactInfoItem icon={<MailIcon className="w-6 h-6" />} title="Email Us">
                                <a href="mailto:support@q-free.com" className="hover:text-primary">support@q-free.com</a>
                            </ContactInfoItem>
                             <ContactInfoItem icon={<PhoneIcon className="w-6 h-6" />} title="Call Us">
                                <a href="tel:+1234567890" className="hover:text-primary">+1 (234) 567-890</a>
                            </ContactInfoItem>
                        </div>
                    </div>
                    {/* Right Side: Form */}
                    <div className="bg-background/50 dark:bg-card/50 p-8 rounded-xl border border-border-color">
                         {isSubmitted ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="p-4 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                                     <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-text-primary">Thank You!</h2>
                                <p className="text-text-secondary mt-2">Your message has been sent successfully. We'll get back to you shortly.</p>
                            </div>
                        ) : (
                             <form onSubmit={handleSubmit} className="space-y-4">
                                 <h3 className="text-2xl font-bold text-text-primary mb-6">Send us a Message</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                                        <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="w-full bg-foreground border border-border-color rounded-md p-2.5 text-text-primary" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                                        <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="w-full bg-foreground border border-border-color rounded-md p-2.5 text-text-primary" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-1">Phone Number</label>
                                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="w-full bg-foreground border border-border-color rounded-md p-2.5 text-text-primary" />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-text-secondary mb-1">Subject</label>
                                    <input type="text" name="subject" id="subject" required value={formData.subject} onChange={handleChange} className="w-full bg-foreground border border-border-color rounded-md p-2.5 text-text-primary" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-1">Message</label>
                                    <textarea name="message" id="message" rows={4} required value={formData.message} onChange={handleChange} className="w-full bg-foreground border border-border-color rounded-md p-2.5 text-text-primary"></textarea>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground"></div> : <SendIcon className="w-5 h-5" />}
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
              </div>
            </div>
        </div>
    );
};

export default CustomerCare;