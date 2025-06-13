import React from 'react';
import { 
  FaLock, 
  FaHome, 
  FaClipboardList, 
  FaCheck, 
  FaTimes, 
  FaEdit, 
  FaSearch, 
  FaCog, 
  FaUser, 
  FaChartBar, 
  FaBullseye, 
  FaBriefcase, 
  FaChartLine, 
  FaChartArea, 
  FaBell, 
  FaStar, 
  FaHeart, 
  FaThumbsUp, 
  FaThumbsDown, 
  FaRocket, 
  FaLightbulb, 
  FaWrench, 
  FaMobileAlt, 
  FaLaptop, 
  FaFire, 
  FaDollarSign, 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaGlobe, 
  FaLink, 
  FaEnvelope, 
  FaPhone, 
  FaPalette, 
  FaMusic, 
  FaFilm, 
  FaCamera, 
  FaGamepad, 
  FaTrophy, 
  FaGift, 
  FaPizzaSlice, 
  FaCoffee,
  FaBolt,
  FaSpinner,
  FaExternalLinkAlt,
  FaDoorOpen,
  FaPlus,
  FaHourglassHalf,
  FaTrash,
  FaPencilAlt,
  FaKey,
  FaSave,
  FaCheckCircle
} from 'react-icons/fa';

import { 
  MdDashboard,
  MdSettings,
  MdPerson,
  MdBarChart,
  MdAssignment,
  MdCheckCircle,
  MdCancel,
  MdCreate,
  MdSearch
} from 'react-icons/md';

import {
  IoMdStats,
  IoMdCheckboxOutline,
  IoMdClose
} from 'react-icons/io';

// Mapeamento de emojis para componentes de ícones
export const iconMap = {
  // Emojis básicos
  '🔒': FaLock,
  '🏠': FaHome,
  '📋': FaClipboardList,
  '✅': FaCheck,
  '❌': FaTimes,
  '📝': FaEdit,
  '🔍': FaSearch,
  '⚙️': FaCog,
  '👤': FaUser,
  '📊': FaChartBar,
  '🎯': FaBullseye,
  '💼': FaBriefcase,
  '📈': FaChartLine,
  '📉': FaChartArea,
  '🔔': FaBell,
  '⭐': FaStar,
  '❤️': FaHeart,
  '👍': FaThumbsUp,
  '👎': FaThumbsDown,
  '🚀': FaRocket,
  '💡': FaLightbulb,
  '🔧': FaWrench,
  '📱': FaMobileAlt,
  '💻': FaLaptop,
  '🌟': FaStar,
  '🎉': FaTrophy,
  '🔥': FaFire,
  '💰': FaDollarSign,
  '📅': FaCalendarAlt,
  '⏰': FaClock,
  '📍': FaMapMarkerAlt,
  '🌍': FaGlobe,
  '🔗': FaLink,
  '📧': FaEnvelope,
  '📞': FaPhone,
  '🎨': FaPalette,
  '🎵': FaMusic,
  '🎬': FaFilm,
  '📷': FaCamera,
  '🎮': FaGamepad,
  '🏆': FaTrophy,
  '🎁': FaGift,
  '🍕': FaPizzaSlice,
  '☕': FaCoffee,
  '⚡': FaBolt,
  '🔄': FaSpinner,
  '🚪': FaDoorOpen,
  '➕': FaPlus,
  '⏳': FaHourglassHalf,
  '🗑️': FaTrash,
  '✏️': FaPencilAlt,
  '🔑': FaKey,
  '💾': FaSave,
  '✔️': FaCheckCircle
};

// Função helper para obter o ícone
export const getIcon = (emoji, props = {}) => {
  const IconComponent = iconMap[emoji];
  if (!IconComponent) {
    console.warn(`Ícone não encontrado para emoji: ${emoji}`);
    return null;
  }
  return <IconComponent {...props} />;
};

// Componente wrapper para facilitar o uso
export const Icon = ({ emoji, className, size, color, ...props }) => {
  const IconComponent = iconMap[emoji];
  
  if (!IconComponent) {
    console.warn(`Ícone não encontrado para emoji: ${emoji}`);
    return <span>{emoji}</span>; // Fallback para o emoji original
  }
  
  return (
    <IconComponent 
      className={className}
      size={size}
      color={color}
      {...props}
    />
  );
};

export default Icon; 