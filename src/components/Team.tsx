import React from 'react';
import { Linkedin, Twitter, Github } from 'lucide-react';

const Team = () => {
  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Former Google AI researcher with 15+ years in tech leadership"
    },
    {
      name: "Michael Rodriguez",
      role: "CTO",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Full-stack architect specializing in scalable cloud solutions"
    },
    {
      name: "Emily Johnson",
      role: "Head of AI",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "PhD in Machine Learning from MIT, published researcher"
    },
    {
      name: "David Kim",
      role: "Lead Developer",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "10+ years building enterprise applications and mobile solutions"
    },
    {
      name: "Lisa Wang",
      role: "Head of Design",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Award-winning UX designer with expertise in user-centered design"
    },
    {
      name: "James Thompson",
      role: "DevOps Engineer",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Cloud infrastructure expert with AWS and Azure certifications"
    }
  ];

  return (
    <section id="team" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our diverse team of experts brings together decades of experience in technology, 
            design, and business to deliver exceptional results for our clients.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {member.name}
              </h3>
              
              <p className="text-blue-600 font-semibold mb-4">
                {member.role}
              </p>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {member.bio}
              </p>
              
              <div className="flex justify-center space-x-4">
                <button className="w-10 h-10 bg-gray-100 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors group">
                  <Linkedin className="w-5 h-5 text-gray-600 group-hover:text-white" />
                </button>
                <button className="w-10 h-10 bg-gray-100 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors group">
                  <Twitter className="w-5 h-5 text-gray-600 group-hover:text-white" />
                </button>
                <button className="w-10 h-10 bg-gray-100 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors group">
                  <Github className="w-5 h-5 text-gray-600 group-hover:text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;