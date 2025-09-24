import React from 'react';
import { Users, BookOpen, Award, Target, Heart, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: 'Passion for Learning',
      description: 'We believe learning should be engaging, accessible, and transformative for everyone.'
    },
    {
      icon: <Target className="h-8 w-8 text-blue-500" />,
      title: 'Excellence in Education',
      description: 'We maintain the highest standards in content quality and educational experience.'
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: 'Community First',
      description: 'We foster a supportive learning community where students help each other succeed.'
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-500" />,
      title: 'Global Accessibility',
      description: 'Quality education should be available to anyone, anywhere, at any time.'
    }
  ];

  const team = [
    {
      name: 'Dr. Sarah Williams',
      role: 'CEO & Founder',
      bio: 'Former professor at MIT with 15 years of experience in educational technology.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Michael Rodriguez',
      role: 'CTO',
      bio: 'Software architect who built learning platforms used by millions of students.',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Dr. Emily Chen',
      role: 'Head of Curriculum',
      bio: 'Educational psychologist specializing in online learning methodologies.',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Fusioned</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
              Empowering learners worldwide with cutting-edge educational technology and expert instruction
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                At Fusioned, we're on a mission to democratize quality education. We believe that 
                everyone deserves access to world-class learning experiences, regardless of their 
                location, background, or circumstances.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Our platform combines the latest in educational technology with proven pedagogical 
                methods to create an engaging, effective, and accessible learning environment for 
                students around the globe.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">2018</div>
                  <div className="text-slate-600 dark:text-gray-300">Founded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">50+</div>
                  <div className="text-slate-600 dark:text-gray-300">Countries Served</div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/3184419/pexels-photo-3184419.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Students learning online"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center transition-colors duration-300">
                <div className="mb-4 flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The passionate educators and technologists behind Fusioned
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md text-center transition-colors duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-indigo-100">Making a difference in education worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-amber-300" />
              <div className="text-3xl font-bold mb-2">1M+</div>
              <div className="text-indigo-200">Lessons Completed</div>
            </div>
            <div>
              <Users className="h-12 w-12 mx-auto mb-4 text-amber-300" />
              <div className="text-3xl font-bold mb-2">100K+</div>
              <div className="text-indigo-200">Active Learners</div>
            </div>
            <div>
              <Award className="h-12 w-12 mx-auto mb-4 text-amber-300" />
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-indigo-200">Certificates Earned</div>
            </div>
            <div>
              <Globe className="h-12 w-12 mx-auto mb-4 text-amber-300" />
              <div className="text-3xl font-bold mb-2">195</div>
              <div className="text-indigo-200">Countries Reached</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;