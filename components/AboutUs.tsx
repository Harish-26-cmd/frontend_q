
import React from 'react';

interface AboutUsProps {
  onGetStarted?: () => void;
}

const TeamMemberCard: React.FC<{
  imageUrl: string;
  name: string;
}> = ({ imageUrl, name }) => (
  <div className="bg-card rounded-xl shadow-lg p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:hover:shadow-primary/20">
    <img
      src={imageUrl}
      alt={`Avatar of ${name}`}
      className="w-32 h-32 mx-auto rounded-full mb-4 object-cover border-4 border-border-color bg-foreground"
    />
    <h3 className="text-xl font-bold text-card-foreground">{name}</h3>
  </div>
);


const AboutUs: React.FC<AboutUsProps> = ({ onGetStarted }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-16 py-12 md:py-20">
        {/* Left side: Text content */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-text-primary mb-4 leading-tight">
            Welcome to <span className="text-primary">Q-Free</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary mb-8">
            Revolutionizing your waiting experience. Q-Free uses cutting-edge AI to predict queue times accurately, allowing you to manage your time effectively. Say goodbye to long, uncertain waits and hello to a smarter way of queuing.
          </p>
          <div className="flex justify-center md:justify-start">
            {onGetStarted && (
              <button 
                onClick={onGetStarted}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-lg transition-all duration-300 text-lg transform hover:scale-105 shadow-lg hover:shadow-primary/50"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
        
        {/* Right side: Image */}
        <div className="w-full h-80 md:h-auto md:max-h-[500px] rounded-2xl overflow-hidden shadow-2xl order-first md:order-last">
          <img 
              src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1400&auto=format&fit=crop" 
              alt="A diverse group of people sitting in a waiting room, some looking at their phones." 
              className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      <div id="about-us-section" className="py-12 md:py-20 border-t border-border-color">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-6">
            The Future of Waiting is Here
          </h2>
          <div className="space-y-4 text-lg text-text-secondary leading-relaxed">
            <p>
              At Q-Free, our mission is to transform the frustrating experience of waiting in line into a seamless, stress-free process. We believe your time is valuable. Instead of being tethered to a physical spot, you should be free to work, relax, or run errands while we hold your place for you.
            </p>
            <p>
              Our system leverages the power of the Google Gemini AI to provide intelligent, real-time wait predictions. By analyzing factors like queue length, service speed, and historical trends, we deliver estimates you can trust. This empowers both customers to manage their day better and businesses to optimize their operations, reduce walk-aways, and improve overall satisfaction.
            </p>
          </div>
        </div>
      </div>

      <div className="py-12 md:py-20 border-t border-border-color">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-12">
            Our Amazing Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <TeamMemberCard
              imageUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=Harish"
              name="Mullaguri Harish"
            />
            <TeamMemberCard
              imageUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=Lokesh"
              name="Bestha Arigela Lokesh"
            />
            <TeamMemberCard
              imageUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=Uday"
              name="Puli Uday Krishna"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutUs;