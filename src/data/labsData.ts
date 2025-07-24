export interface Lab {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  technology: string[];
  provider: string;
  rating: number;
  students: number;
  image: string;
  features: string[];
  objectives: string[];
  prerequisites: string[];
  isPopular?: boolean;
  isFree?: boolean;
}

export interface LabCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export const labCategories: LabCategory[] = [
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    description: 'Hands-on labs for AWS, Azure, and Google Cloud',
    icon: 'Cloud',
    count: 45
  },
  {
    id: 'devops',
    name: 'DevOps',
    description: 'CI/CD, Docker, Kubernetes, and automation',
    icon: 'GitBranch',
    count: 32
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    description: 'Security testing, penetration testing, and compliance',
    icon: 'Shield',
    count: 28
  },
  {
    id: 'data-science',
    name: 'Data Science',
    description: 'Machine learning, analytics, and big data',
    icon: 'BarChart3',
    count: 38
  },
  {
    id: 'web-development',
    name: 'Web Development',
    description: 'Frontend, backend, and full-stack development',
    icon: 'Code',
    count: 42
  },
  {
    id: 'mobile-development',
    name: 'Mobile Development',
    description: 'iOS, Android, and cross-platform development',
    icon: 'Smartphone',
    count: 25
  },
  {
    id: 'blockchain',
    name: 'Blockchain',
    description: 'Smart contracts, DeFi, and cryptocurrency',
    icon: 'Link',
    count: 18
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    description: 'Deep learning, NLP, and computer vision',
    icon: 'Brain',
    count: 35
  }
];

export const labs: Lab[] = [
  {
    id: 'aws-ec2-setup',
    title: 'AWS EC2 Instance Setup and Configuration',
    description: 'Learn to launch, configure, and manage EC2 instances with security groups and key pairs.',
    category: 'cloud-computing',
    difficulty: 'Beginner',
    duration: '45 minutes',
    technology: ['AWS', 'EC2', 'Linux', 'SSH'],
    provider: 'AWS',
    rating: 4.8,
    students: 12500,
    image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
    features: ['Live AWS Environment', 'Step-by-step Guide', 'Real-world Scenarios'],
    objectives: [
      'Launch and configure EC2 instances',
      'Set up security groups and network access',
      'Connect to instances using SSH',
      'Understand AWS pricing and billing'
    ],
    prerequisites: ['Basic understanding of cloud computing', 'Familiarity with command line'],
    isPopular: true,
    isFree: false
  },
  {
    id: 'docker-containerization',
    title: 'Docker Containerization Fundamentals',
    description: 'Master Docker containers, images, and orchestration with hands-on practice.',
    category: 'devops',
    difficulty: 'Intermediate',
    duration: '90 minutes',
    technology: ['Docker', 'Linux', 'Container', 'DevOps'],
    provider: 'Docker',
    rating: 4.9,
    students: 8900,
    image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
    features: ['Interactive Terminal', 'Pre-configured Environment', 'Real Applications'],
    objectives: [
      'Create and manage Docker containers',
      'Build custom Docker images',
      'Understand Docker networking',
      'Deploy multi-container applications'
    ],
    prerequisites: ['Basic Linux knowledge', 'Understanding of virtualization'],
    isPopular: true,
    isFree: true
  },
  {
    id: 'kubernetes-deployment',
    title: 'Kubernetes Cluster Deployment',
    description: 'Deploy and manage applications on Kubernetes clusters with pods, services, and ingress.',
    category: 'devops',
    difficulty: 'Advanced',
    duration: '120 minutes',
    technology: ['Kubernetes', 'Docker', 'YAML', 'kubectl'],
    provider: 'Kubernetes',
    rating: 4.7,
    students: 6200,
    image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
    features: ['Live K8s Cluster', 'Production Scenarios', 'Troubleshooting Guide'],
    objectives: [
      'Deploy applications to Kubernetes',
      'Configure services and ingress',
      'Manage persistent storage',
      'Monitor and troubleshoot deployments'
    ],
    prerequisites: ['Docker experience', 'YAML knowledge', 'Container orchestration basics'],
    isPopular: false,
    isFree: false
  },
  {
    id: 'ethical-hacking-basics',
    title: 'Ethical Hacking and Penetration Testing',
    description: 'Learn ethical hacking techniques and conduct security assessments in a safe environment.',
    category: 'cybersecurity',
    difficulty: 'Intermediate',
    duration: '150 minutes',
    technology: ['Kali Linux', 'Nmap', 'Metasploit', 'Wireshark'],
    provider: 'Security Labs',
    rating: 4.8,
    students: 9800,
    image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=600',
    features: ['Isolated Lab Environment', 'Real Vulnerabilities', 'Legal Framework'],
    objectives: [
      'Perform network reconnaissance',
      'Identify security vulnerabilities',
      'Exploit common weaknesses',
      'Document findings and recommendations'
    ],
    prerequisites: ['Network fundamentals', 'Linux command line', 'Security awareness'],
    isPopular: true,
    isFree: false
  },
  {
    id: 'machine-learning-python',
    title: 'Machine Learning with Python and Scikit-learn',
    description: 'Build and train machine learning models using Python, pandas, and scikit-learn.',
    category: 'data-science',
    difficulty: 'Intermediate',
    duration: '180 minutes',
    technology: ['Python', 'Scikit-learn', 'Pandas', 'Jupyter'],
    provider: 'Data Labs',
    rating: 4.9,
    students: 11200,
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
    features: ['Jupyter Notebooks', 'Real Datasets', 'Model Evaluation'],
    objectives: [
      'Prepare and clean datasets',
      'Train classification and regression models',
      'Evaluate model performance',
      'Deploy models for prediction'
    ],
    prerequisites: ['Python programming', 'Statistics basics', 'Data analysis concepts'],
    isPopular: true,
    isFree: true
  },
  {
    id: 'react-fullstack-app',
    title: 'Full-Stack React Application Development',
    description: 'Build a complete web application with React frontend and Node.js backend.',
    category: 'web-development',
    difficulty: 'Intermediate',
    duration: '240 minutes',
    technology: ['React', 'Node.js', 'MongoDB', 'Express'],
    provider: 'Web Labs',
    rating: 4.7,
    students: 7800,
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600',
    features: ['Live Development Environment', 'Database Integration', 'API Development'],
    objectives: [
      'Create responsive React components',
      'Build RESTful APIs with Node.js',
      'Integrate with MongoDB database',
      'Deploy full-stack application'
    ],
    prerequisites: ['JavaScript fundamentals', 'HTML/CSS knowledge', 'Basic React understanding'],
    isPopular: false,
    isFree: false
  },
  {
    id: 'ios-swift-development',
    title: 'iOS App Development with Swift',
    description: 'Create native iOS applications using Swift and Xcode with modern UI frameworks.',
    category: 'mobile-development',
    difficulty: 'Beginner',
    duration: '200 minutes',
    technology: ['Swift', 'Xcode', 'UIKit', 'SwiftUI'],
    provider: 'Mobile Labs',
    rating: 4.6,
    students: 5400,
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=600',
    features: ['Xcode Simulator', 'Interface Builder', 'App Store Guidelines'],
    objectives: [
      'Design user interfaces with SwiftUI',
      'Implement navigation and data flow',
      'Integrate device features',
      'Prepare app for App Store submission'
    ],
    prerequisites: ['Programming fundamentals', 'Object-oriented concepts'],
    isPopular: false,
    isFree: true
  },
  {
    id: 'blockchain-smart-contracts',
    title: 'Smart Contract Development with Solidity',
    description: 'Learn to develop, test, and deploy smart contracts on Ethereum blockchain.',
    category: 'blockchain',
    difficulty: 'Advanced',
    duration: '180 minutes',
    technology: ['Solidity', 'Ethereum', 'Web3', 'Truffle'],
    provider: 'Blockchain Labs',
    rating: 4.5,
    students: 3200,
    image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600',
    features: ['Test Network', 'Smart Contract Templates', 'Gas Optimization'],
    objectives: [
      'Write secure smart contracts',
      'Test contract functionality',
      'Deploy to test networks',
      'Interact with contracts via Web3'
    ],
    prerequisites: ['Programming experience', 'Blockchain fundamentals', 'Cryptocurrency knowledge'],
    isPopular: false,
    isFree: false
  },
  {
    id: 'tensorflow-deep-learning',
    title: 'Deep Learning with TensorFlow',
    description: 'Build neural networks and deep learning models using TensorFlow and Keras.',
    category: 'ai-ml',
    difficulty: 'Advanced',
    duration: '300 minutes',
    technology: ['TensorFlow', 'Keras', 'Python', 'Neural Networks'],
    provider: 'AI Labs',
    rating: 4.8,
    students: 4600,
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
    features: ['GPU Acceleration', 'Pre-trained Models', 'Model Visualization'],
    objectives: [
      'Design neural network architectures',
      'Train deep learning models',
      'Implement computer vision solutions',
      'Deploy models for inference'
    ],
    prerequisites: ['Python programming', 'Machine learning basics', 'Linear algebra'],
    isPopular: true,
    isFree: false
  },
  {
    id: 'azure-devops-pipeline',
    title: 'Azure DevOps CI/CD Pipeline',
    description: 'Create automated build and deployment pipelines using Azure DevOps services.',
    category: 'devops',
    difficulty: 'Intermediate',
    duration: '120 minutes',
    technology: ['Azure DevOps', 'YAML', 'Git', 'Docker'],
    provider: 'Microsoft',
    rating: 4.7,
    students: 6800,
    image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
    features: ['Live Azure Environment', 'Pipeline Templates', 'Integration Testing'],
    objectives: [
      'Set up source control with Git',
      'Create build pipelines',
      'Configure release pipelines',
      'Implement automated testing'
    ],
    prerequisites: ['Git knowledge', 'Basic DevOps concepts', 'YAML syntax'],
    isPopular: false,
    isFree: true
  },
  {
    id: 'network-security-analysis',
    title: 'Network Security Analysis and Monitoring',
    description: 'Analyze network traffic and detect security threats using industry-standard tools.',
    category: 'cybersecurity',
    difficulty: 'Advanced',
    duration: '160 minutes',
    technology: ['Wireshark', 'Snort', 'pfSense', 'SIEM'],
    provider: 'Security Labs',
    rating: 4.6,
    students: 4200,
    image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=600',
    features: ['Network Simulation', 'Threat Detection', 'Incident Response'],
    objectives: [
      'Capture and analyze network packets',
      'Identify malicious activities',
      'Configure intrusion detection systems',
      'Create security monitoring dashboards'
    ],
    prerequisites: ['Network protocols', 'Security fundamentals', 'Command line proficiency'],
    isPopular: false,
    isFree: false
  },
  {
    id: 'big-data-spark',
    title: 'Big Data Processing with Apache Spark',
    description: 'Process large datasets efficiently using Apache Spark and distributed computing.',
    category: 'data-science',
    difficulty: 'Advanced',
    duration: '220 minutes',
    technology: ['Apache Spark', 'Scala', 'Hadoop', 'HDFS'],
    provider: 'Big Data Labs',
    rating: 4.5,
    students: 3800,
    image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600',
    features: ['Cluster Environment', 'Large Datasets', 'Performance Optimization'],
    objectives: [
      'Set up Spark clusters',
      'Process structured and unstructured data',
      'Optimize Spark applications',
      'Integrate with data storage systems'
    ],
    prerequisites: ['Programming experience', 'Database knowledge', 'Distributed systems concepts'],
    isPopular: false,
    isFree: false
  }
];