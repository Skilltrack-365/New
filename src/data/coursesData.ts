export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  instructor: string;
  rating: number;
  students: number;
  image: string;
  features: string[];
}

export interface ServiceData {
  id: string;
  title: string;
  description: string;
  icon: string;
  courses: Course[];
}

export const servicesData: ServiceData[] = [
  {
    id: 'ai-machine-learning',
    title: 'AI & Machine Learning',
    description: 'Master artificial intelligence and machine learning with hands-on projects and real-world applications.',
    icon: 'Brain',
    courses: [
      {
        id: 'ml-fundamentals',
        title: 'Machine Learning Fundamentals',
        description: 'Learn the core concepts of machine learning including supervised and unsupervised learning algorithms.',
        duration: '8 weeks',
        level: 'Beginner',
        price: 299,
        instructor: 'Dr. Sarah Chen',
        rating: 4.8,
        students: 1250,
        image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Linear Regression', 'Decision Trees', 'Neural Networks', 'Model Evaluation']
      },
      {
        id: 'deep-learning',
        title: 'Deep Learning with TensorFlow',
        description: 'Build and deploy deep neural networks using TensorFlow for image recognition and NLP tasks.',
        duration: '12 weeks',
        level: 'Intermediate',
        price: 499,
        instructor: 'Prof. Michael Zhang',
        rating: 4.9,
        students: 890,
        image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['CNNs', 'RNNs', 'Transfer Learning', 'Model Deployment']
      },
      {
        id: 'nlp-processing',
        title: 'Natural Language Processing',
        description: 'Process and analyze text data using advanced NLP techniques and transformer models.',
        duration: '10 weeks',
        level: 'Advanced',
        price: 599,
        instructor: 'Dr. Emily Rodriguez',
        rating: 4.7,
        students: 650,
        image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['BERT', 'GPT Models', 'Sentiment Analysis', 'Text Generation']
      },
      {
        id: 'computer-vision',
        title: 'Computer Vision Applications',
        description: 'Develop computer vision systems for object detection, facial recognition, and image processing.',
        duration: '10 weeks',
        level: 'Intermediate',
        price: 549,
        instructor: 'Dr. Alex Kim',
        rating: 4.8,
        students: 720,
        image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['OpenCV', 'Object Detection', 'Face Recognition', 'Image Segmentation']
      },
      {
        id: 'ai-ethics',
        title: 'AI Ethics and Responsible AI',
        description: 'Understand the ethical implications of AI and learn to build responsible AI systems.',
        duration: '6 weeks',
        level: 'Beginner',
        price: 199,
        instructor: 'Prof. Lisa Wang',
        rating: 4.6,
        students: 980,
        image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Bias Detection', 'Fairness Metrics', 'Explainable AI', 'Privacy Protection']
      }
    ]
  },
  {
    id: 'software-development',
    title: 'Software Development',
    description: 'Master modern software development practices with full-stack technologies and best practices.',
    icon: 'Code',
    courses: [
      {
        id: 'fullstack-javascript',
        title: 'Full-Stack JavaScript Development',
        description: 'Build complete web applications using React, Node.js, and modern JavaScript frameworks.',
        duration: '16 weeks',
        level: 'Intermediate',
        price: 699,
        instructor: 'John Martinez',
        rating: 4.9,
        students: 1500,
        image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['React.js', 'Node.js', 'MongoDB', 'REST APIs']
      },
      {
        id: 'python-backend',
        title: 'Python Backend Development',
        description: 'Create scalable backend systems using Python, Django, and PostgreSQL.',
        duration: '12 weeks',
        level: 'Intermediate',
        price: 549,
        instructor: 'Maria Garcia',
        rating: 4.8,
        students: 1100,
        image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Django', 'PostgreSQL', 'API Design', 'Testing']
      },
      {
        id: 'mobile-development',
        title: 'React Native Mobile Development',
        description: 'Build cross-platform mobile applications for iOS and Android using React Native.',
        duration: '14 weeks',
        level: 'Intermediate',
        price: 599,
        instructor: 'David Chen',
        rating: 4.7,
        students: 850,
        image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['React Native', 'Navigation', 'State Management', 'App Store Deployment']
      },
      {
        id: 'microservices',
        title: 'Microservices Architecture',
        description: 'Design and implement microservices using Docker, Kubernetes, and service mesh.',
        duration: '10 weeks',
        level: 'Advanced',
        price: 749,
        instructor: 'Robert Kim',
        rating: 4.9,
        students: 600,
        image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Docker', 'Kubernetes', 'Service Mesh', 'API Gateway']
      },
      {
        id: 'software-testing',
        title: 'Software Testing & Quality Assurance',
        description: 'Master testing strategies including unit testing, integration testing, and test automation.',
        duration: '8 weeks',
        level: 'Beginner',
        price: 399,
        instructor: 'Jennifer Liu',
        rating: 4.6,
        students: 920,
        image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Jest', 'Cypress', 'Test Automation', 'CI/CD Testing']
      }
    ]
  },
  {
    id: 'cloud-solutions',
    title: 'Cloud Solutions',
    description: 'Learn cloud computing with AWS, Azure, and Google Cloud Platform for scalable applications.',
    icon: 'Cloud',
    courses: [
      {
        id: 'aws-fundamentals',
        title: 'AWS Cloud Fundamentals',
        description: 'Master Amazon Web Services core services including EC2, S3, RDS, and Lambda.',
        duration: '10 weeks',
        level: 'Beginner',
        price: 449,
        instructor: 'Thomas Anderson',
        rating: 4.8,
        students: 1300,
        image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['EC2', 'S3', 'RDS', 'Lambda Functions']
      },
      {
        id: 'azure-devops',
        title: 'Azure DevOps & CI/CD',
        description: 'Implement continuous integration and deployment pipelines using Azure DevOps.',
        duration: '8 weeks',
        level: 'Intermediate',
        price: 499,
        instructor: 'Sarah Johnson',
        rating: 4.7,
        students: 780,
        image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Azure Pipelines', 'ARM Templates', 'Container Registry', 'Monitoring']
      },
      {
        id: 'kubernetes-orchestration',
        title: 'Kubernetes Container Orchestration',
        description: 'Deploy and manage containerized applications at scale using Kubernetes.',
        duration: '12 weeks',
        level: 'Advanced',
        price: 649,
        instructor: 'Michael Brown',
        rating: 4.9,
        students: 550,
        image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Pod Management', 'Services', 'Ingress', 'Helm Charts']
      },
      {
        id: 'serverless-computing',
        title: 'Serverless Computing',
        description: 'Build serverless applications using AWS Lambda, Azure Functions, and Google Cloud Functions.',
        duration: '6 weeks',
        level: 'Intermediate',
        price: 399,
        instructor: 'Lisa Chen',
        rating: 4.6,
        students: 690,
        image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Lambda Functions', 'API Gateway', 'Event-Driven Architecture', 'Cost Optimization']
      },
      {
        id: 'cloud-security',
        title: 'Cloud Security Best Practices',
        description: 'Secure cloud infrastructure and applications using industry best practices and tools.',
        duration: '8 weeks',
        level: 'Advanced',
        price: 549,
        instructor: 'James Wilson',
        rating: 4.8,
        students: 420,
        image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['IAM', 'Encryption', 'Network Security', 'Compliance']
      }
    ]
  },
  {
    id: 'mobile-development',
    title: 'Mobile Development',
    description: 'Create native and cross-platform mobile applications for iOS and Android platforms.',
    icon: 'Smartphone',
    courses: [
      {
        id: 'ios-swift',
        title: 'iOS Development with Swift',
        description: 'Build native iOS applications using Swift and Xcode with modern iOS frameworks.',
        duration: '14 weeks',
        level: 'Beginner',
        price: 599,
        instructor: 'Emma Davis',
        rating: 4.8,
        students: 950,
        image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Swift Language', 'UIKit', 'SwiftUI', 'Core Data']
      },
      {
        id: 'android-kotlin',
        title: 'Android Development with Kotlin',
        description: 'Create Android applications using Kotlin and Android Studio with Jetpack Compose.',
        duration: '14 weeks',
        level: 'Beginner',
        price: 599,
        instructor: 'Ryan Park',
        rating: 4.7,
        students: 1100,
        image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Kotlin', 'Jetpack Compose', 'Room Database', 'Material Design']
      },
      {
        id: 'flutter-development',
        title: 'Flutter Cross-Platform Development',
        description: 'Build beautiful cross-platform mobile apps using Flutter and Dart programming language.',
        duration: '12 weeks',
        level: 'Intermediate',
        price: 549,
        instructor: 'Priya Sharma',
        rating: 4.9,
        students: 800,
        image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Dart Language', 'Widget System', 'State Management', 'Firebase Integration']
      },
      {
        id: 'mobile-ui-ux',
        title: 'Mobile UI/UX Design',
        description: 'Design intuitive and engaging mobile user interfaces following platform guidelines.',
        duration: '8 weeks',
        level: 'Beginner',
        price: 399,
        instructor: 'Sophie Martinez',
        rating: 4.6,
        students: 720,
        image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Design Principles', 'Prototyping', 'User Testing', 'Accessibility']
      },
      {
        id: 'mobile-testing',
        title: 'Mobile App Testing & Deployment',
        description: 'Test mobile applications and deploy them to App Store and Google Play Store.',
        duration: '6 weeks',
        level: 'Intermediate',
        price: 349,
        instructor: 'Alex Thompson',
        rating: 4.5,
        students: 580,
        image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Unit Testing', 'UI Testing', 'App Store Guidelines', 'Beta Testing']
      }
    ]
  },
  {
    id: 'data-engineering',
    title: 'Data Engineering',
    description: 'Build robust data pipelines and analytics platforms to process and analyze big data.',
    icon: 'Database',
    courses: [
      {
        id: 'data-pipelines',
        title: 'Data Pipeline Engineering',
        description: 'Design and build scalable data pipelines using Apache Airflow and modern ETL tools.',
        duration: '10 weeks',
        level: 'Intermediate',
        price: 549,
        instructor: 'Daniel Rodriguez',
        rating: 4.8,
        students: 680,
        image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Apache Airflow', 'ETL Processes', 'Data Quality', 'Pipeline Monitoring']
      },
      {
        id: 'big-data-spark',
        title: 'Big Data Processing with Spark',
        description: 'Process large datasets efficiently using Apache Spark and distributed computing.',
        duration: '12 weeks',
        level: 'Advanced',
        price: 649,
        instructor: 'Rachel Kim',
        rating: 4.9,
        students: 520,
        image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Apache Spark', 'PySpark', 'Spark SQL', 'Cluster Computing']
      },
      {
        id: 'data-warehousing',
        title: 'Modern Data Warehousing',
        description: 'Build data warehouses using Snowflake, BigQuery, and dimensional modeling techniques.',
        duration: '8 weeks',
        level: 'Intermediate',
        price: 499,
        instructor: 'Kevin Zhang',
        rating: 4.7,
        students: 750,
        image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Snowflake', 'BigQuery', 'Dimensional Modeling', 'Data Marts']
      },
      {
        id: 'streaming-data',
        title: 'Real-time Data Streaming',
        description: 'Process streaming data using Apache Kafka, Kinesis, and real-time analytics.',
        duration: '10 weeks',
        level: 'Advanced',
        price: 599,
        instructor: 'Maria Santos',
        rating: 4.8,
        students: 450,
        image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Apache Kafka', 'Stream Processing', 'Real-time Analytics', 'Event Sourcing']
      },
      {
        id: 'data-visualization',
        title: 'Data Visualization & BI',
        description: 'Create compelling data visualizations and business intelligence dashboards.',
        duration: '6 weeks',
        level: 'Beginner',
        price: 349,
        instructor: 'Anna Lee',
        rating: 4.6,
        students: 890,
        image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Tableau', 'Power BI', 'D3.js', 'Dashboard Design']
      }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Protect digital assets and learn ethical hacking, security auditing, and incident response.',
    icon: 'Shield',
    courses: [
      {
        id: 'ethical-hacking',
        title: 'Ethical Hacking & Penetration Testing',
        description: 'Learn ethical hacking techniques and conduct professional penetration testing.',
        duration: '12 weeks',
        level: 'Intermediate',
        price: 649,
        instructor: 'Marcus Johnson',
        rating: 4.9,
        students: 720,
        image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Penetration Testing', 'Vulnerability Assessment', 'Network Security', 'Web Application Security']
      },
      {
        id: 'incident-response',
        title: 'Cybersecurity Incident Response',
        description: 'Develop skills to detect, analyze, and respond to cybersecurity incidents effectively.',
        duration: '8 weeks',
        level: 'Advanced',
        price: 549,
        instructor: 'Sarah Mitchell',
        rating: 4.8,
        students: 480,
        image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Incident Handling', 'Digital Forensics', 'Malware Analysis', 'Recovery Planning']
      },
      {
        id: 'cloud-security',
        title: 'Cloud Security Architecture',
        description: 'Secure cloud environments and implement security best practices for cloud platforms.',
        duration: '10 weeks',
        level: 'Intermediate',
        price: 599,
        instructor: 'David Wilson',
        rating: 4.7,
        students: 620,
        image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['AWS Security', 'Azure Security', 'Identity Management', 'Compliance']
      },
      {
        id: 'network-security',
        title: 'Network Security Fundamentals',
        description: 'Understand network protocols, firewalls, and intrusion detection systems.',
        duration: '8 weeks',
        level: 'Beginner',
        price: 449,
        instructor: 'Jennifer Adams',
        rating: 4.6,
        students: 850,
        image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['Network Protocols', 'Firewalls', 'IDS/IPS', 'VPN Security']
      },
      {
        id: 'security-compliance',
        title: 'Security Compliance & Risk Management',
        description: 'Learn regulatory compliance frameworks and risk assessment methodologies.',
        duration: '6 weeks',
        level: 'Beginner',
        price: 399,
        instructor: 'Robert Taylor',
        rating: 4.5,
        students: 690,
        image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: ['GDPR', 'HIPAA', 'Risk Assessment', 'Audit Preparation']
      }
    ]
  }
];