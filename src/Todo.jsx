import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Circle, CheckCircle2, Sparkles, Star, Play, Pause, RotateCcw, Clock, X, Component } from 'lucide-react';


export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedTaskText, setCompletedTaskText] = useState('');
  
  // Pomodoro state
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState('work');
  const [motivationIndex, setMotivationIndex] = useState(0);

  const workMotivations = [
    { text: "You're crushing it! Keep that focus! 💪", icon: "🚀" },
    { text: "Amazing work! Stay in the zone! ⚡", icon: "⚡" },
    { text: "You've got this! Excellence in progress! 🌟", icon: "🌟" },
    { text: "Unstoppable today! Keep going! 🔥", icon: "🔥" },
    { text: "Great focus! Victory is near! 💎", icon: "💎" },
    { text: "Strong work! Don't stop now! 🎯", icon: "🎯" },
    { text: "You're doing amazing! Push forward! ✨", icon: "✨" },
    { text: "Almost there! Finish strong! 🏆", icon: "🏆" }
  ];

  const breakMotivations = [
    { text: "Time to recharge! You've earned it! ☕", icon: "☕" },
    { text: "Relax and breathe! Great job today! 🌸", icon: "🌸" },
    { text: "Enjoy your break! Rest powers success! 🌈", icon: "🌈" },
    { text: "Take it easy! You're doing wonderful! 🎈", icon: "🎈" },
    { text: "Refresh your mind! Come back stronger! 🌺", icon: "🌺" }
  ];

  const celebrationMessages = [
    "🎉 Woohoo! You absolutely crushed it!",
    "🌟 Amazing! You're a productivity superstar!",
    "🎊 Fantastic work! You're unstoppable!",
    "✨ Brilliant! Another victory for you!",
    "🏆 Champion! You're making it happen!",
    "💫 Incredible! Keep this momentum going!",
    "🎯 Nailed it! You're on fire today!",
    "🚀 Outstanding! You're reaching new heights!"
  ];

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    let interval = null;
    if (isRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(time => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setIsRunning(false);
      if (pomodoroMode === 'work') {
        setPomodoroMode('break');
        setPomodoroTime(5 * 60);
      } else {
        setPomodoroMode('work');
        setPomodoroTime(25 * 60);
      }
      setMotivationIndex(0);
    }
    return () => clearInterval(interval);
  }, [isRunning, pomodoroTime, pomodoroMode]);

  useEffect(() => {
    if (isRunning) {
      const interval = pomodoroMode === 'work' ? 300000 : 120000;
      const motivationTimer = setInterval(() => {
        const messages = pomodoroMode === 'work' ? workMotivations : breakMotivations;
        setMotivationIndex(prev => (prev + 1) % messages.length);
      }, interval);
      return () => clearInterval(motivationTimer);
    }
  }, [isRunning, pomodoroMode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetPomodoro = () => {
    setIsRunning(false);
    if (pomodoroMode === 'work') {
      setPomodoroTime(25 * 60);
    } else {
      setPomodoroTime(5 * 60);
    }
    setMotivationIndex(0);
  };

  const addTodo = () => {
    if (input.trim()) {
      setIsAdding(true);
      const newTodo = {
        id: Date.now(),
        text: input.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        isNew: true
      };
      setTodos([...todos, newTodo]);
      setInput('');
      
      setTimeout(() => {
        setIsAdding(false);
        setTodos(prevTodos => prevTodos.map(todo => ({ ...todo, isNew: false })));
      }, 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const toggleTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    if (todo && !todo.completed) {
      setCompletedTaskText(todo.text);
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
      }, 4000);
    }
    
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));

    if (selectedTask === id && !todo.completed) {
      setSelectedTask(null);
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, isDeleting: true } : todo
    ));
    setTimeout(() => {
      setTodos(todos.filter(todo => todo.id !== id));
      if (selectedTask === id) {
        setSelectedTask(null);
      }
    }, 300);
  };

  const clearCompleted = () => {
    setTodos(todos.map(todo =>
      todo.completed ? { ...todo, isDeleting: true } : todo
    ));
    setTimeout(() => {
      setTodos(todos.filter(todo => !todo.completed));
    }, 300);
  };

  const startPomodoroForTask = (taskId) => {
    if (selectedTask === taskId && isRunning) {
      setIsRunning(false);
    } else if (selectedTask === taskId && !isRunning) {
      setIsRunning(true);
    } else {
      setSelectedTask(taskId);
      setIsRunning(true);
      setMotivationIndex(0);
      if (pomodoroMode === 'work') {
        setPomodoroTime(25 * 60);
      }
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  };

  const emojis = ['🎯', '✨', '🚀', '⭐', '💜', '🎨', '🌟', '💫'];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  const selectedTaskData = todos.find(t => t.id === selectedTask);

  const currentMotivation = pomodoroMode === 'work' 
    ? workMotivations[motivationIndex % workMotivations.length]
    : breakMotivations[motivationIndex % breakMotivations.length];

  const randomCelebration = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 py-4 sm:py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Celebration Popup */}
        {showCelebration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-celebration-bounce border-4 border-purple-300 relative">
              <button
                onClick={() => setShowCelebration(false)}
                className="absolute top-4 right-4 text-purple-400 hover:text-purple-600 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="text-center">
                <div className="text-7xl mb-4 animate-bounce-celebration">
                  🎉
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-3">
                  {randomCelebration}
                </h2>
                <p className="text-gray-600 mb-2 font-medium">You completed:</p>
                <p className="text-purple-600 font-bold text-lg mb-4 px-4 py-2 bg-purple-50 rounded-xl">
                  "{completedTaskText}"
                </p>
                <div className="flex gap-2 justify-center text-4xl animate-confetti">
                  <span className="animate-spin-slow">✨</span>
                  <span className="animate-bounce-slow">🌟</span>
                  <span className="animate-spin-slow">💫</span>
                  <span className="animate-bounce-slow">⭐</span>
                </div>
                <p className="text-sm text-purple-500 mt-4 font-medium">
                  Keep up the amazing work! 💪
                </p>
              </div>
            </div>
          </div>
        )}

        {/* App Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <Star className="text-purple-500 animate-pulse" size={24} />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              TaskJoy
            </h1>
            <Sparkles className="text-purple-500 animate-bounce" size={24} />
          </div>
          <p className="text-purple-400 text-xs sm:text-sm font-medium">Make your day wonderful, one task at a time! {randomEmoji}</p>
        </div>

        {/* Motivation Banner */}
        {isRunning && (
          <div className={`mb-4 transition-all duration-500 animate-slide-down ${
            pomodoroMode === 'work' 
              ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
              : 'bg-gradient-to-r from-green-400 to-green-500'
          } rounded-2xl p-4 text-center shadow-lg`}>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl animate-bounce-slow">{currentMotivation.icon}</span>
              <p className="text-white font-bold text-sm sm:text-base animate-fade-in">
                {currentMotivation.text}
              </p>
            </div>
          </div>
        )}

        {/* Main Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-purple-100">
          {/* Top Section: Stats + Mini Pomodoro */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-400 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Stats */}
              <div className="flex gap-3 text-white">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full transform hover:scale-110 transition-transform duration-200">
                  <span className="text-xs sm:text-sm font-semibold">✨ {stats.active} To Do</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full transform hover:scale-110 transition-transform duration-200">
                  <span className="text-xs sm:text-sm font-semibold">🎉 {stats.completed} Done</span>
                </div>
              </div>

              {/* Compact Pomodoro */}
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl">
                <div className="flex flex-col items-center">
                  <Clock size={16} className="text-white mb-1" />
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    pomodoroMode === 'work' 
                      ? 'bg-white/30 text-white' 
                      : 'bg-green-400/50 text-white'
                  }`}>
                    {pomodoroMode === 'work' ? '💼' : '☕'}
                  </span>
                </div>
                
                <div className="text-center">
                  <div className={`text-2xl font-bold text-white transition-all duration-300 ${
                    isRunning ? 'animate-pulse' : ''
                  }`}>
                    {formatTime(pomodoroTime)}
                  </div>
                  {selectedTaskData && (
                    <div className="text-xs text-white/90 truncate max-w-32 font-medium">
                      {selectedTaskData.text}
                    </div>
                  )}
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    disabled={!selectedTask}
                    className="bg-white/30 hover:bg-white/40 text-white p-2 rounded-full active:scale-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRunning ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                  </button>
                  <button
                    onClick={resetPomodoro}
                    className="bg-white/30 hover:bg-white/40 text-white p-2 rounded-full active:scale-90 transition-all duration-200"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Add Task Section */}
          <div className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-white">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What magical thing will you do today? ✨"
                className="flex-1 px-5 py-3 border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-400 text-sm sm:text-base transition-all duration-200 placeholder-purple-300"
              />
              <button
                onClick={addTodo}
                disabled={isAdding}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-purple-600 hover:to-purple-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 font-bold disabled:opacity-70 shadow-lg hover:shadow-xl"
              >
                <Plus size={20} className={isAdding ? 'animate-spin' : ''} />
                <span>Add Joy</span>
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b-2 border-purple-100 bg-white">
            {[
              { key: 'all', emoji: '📋', label: 'All' },
              { key: 'active', emoji: '⚡', label: 'Active' },
              { key: 'completed', emoji: '✅', label: 'Done' }
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex-1 py-3 px-2 text-xs sm:text-sm font-bold capitalize transition-all duration-300 active:scale-95 ${
                  filter === f.key
                    ? 'text-purple-600 border-b-4 border-purple-500 bg-purple-50'
                    : 'text-gray-400 hover:text-purple-400 hover:bg-purple-50/50'
                }`}
              >
                <span className="text-base sm:text-lg mr-1">{f.emoji}</span>
                {f.label}
                <span className="ml-1 text-xs">
                  ({f.key === 'all' ? stats.total : f.key === 'active' ? stats.active : stats.completed})
                </span>
              </button>
            ))}
          </div>

          {/* Todo List */}
          <div className="max-h-96 overflow-y-auto bg-gradient-to-b from-white to-purple-50">
            {filteredTodos.length === 0 ? (
              <div className="p-12 text-center text-purple-300">
                <div className="text-5xl mb-3 animate-bounce">🎈</div>
                <p className="text-lg font-semibold">No tasks here!</p>
                <p className="text-sm mt-1">Add something fun to get started 🌟</p>
              </div>
            ) : (
              <ul className="divide-y divide-purple-100 p-2">
                {filteredTodos.map((todo) => (
                  <li
                    key={todo.id}
                    className={`p-3 sm:p-4 rounded-2xl my-2 transition-all duration-300 ${
                      todo.isNew ? 'animate-slide-in bg-purple-100 scale-105' : 'hover:bg-purple-50'
                    } ${
                      todo.isDeleting ? 'animate-slide-out opacity-0' : ''
                    } ${
                      todo.completed ? 'bg-gradient-to-r from-purple-50 to-white' : 'bg-white'
                    } ${
                      selectedTask === todo.id && isRunning ? 'ring-2 ring-purple-400 shadow-lg' : 'shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className="flex-shrink-0 text-purple-300 hover:text-purple-500 transition-all duration-200 active:scale-90 hover:scale-125 transform hover:rotate-12 mt-1"
                      >
                        {todo.completed ? (
                          <CheckCircle2 size={24} className="text-purple-500 animate-bounce-once" />
                        ) : (
                          <Circle size={24} className="hover:fill-purple-100" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <span
                          className={`block text-sm sm:text-base break-words transition-all duration-200 ${
                            todo.completed
                              ? 'line-through text-purple-300 italic'
                              : 'text-gray-700 font-medium'
                          }`}
                        >
                          {todo.text}
                        </span>
                        
                        {!todo.completed && (
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => startPomodoroForTask(todo.id)}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 ${
                                selectedTask === todo.id && isRunning
                                  ? 'bg-purple-500 text-white shadow-md'
                                  : selectedTask === todo.id && !isRunning
                                  ? 'bg-purple-400 text-white shadow-md'
                                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                              }`}
                            >
                              {selectedTask === todo.id && isRunning ? (
                                <>
                                  <Pause size={12} />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play size={12} />
                                  Start Focus
                                </>
                              )}
                            </button>
                            {selectedTask === todo.id && (
                              <span className="text-xs text-purple-500 font-medium animate-pulse">
                                🍅 Working on this task
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="flex-shrink-0 text-purple-300 hover:text-purple-500 transition-all duration-200 active:scale-90 hover:scale-125 transform hover:rotate-12 p-2 rounded-full hover:bg-purple-100 mt-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Clear Completed */}
          {stats.completed > 0 && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-white border-t-2 border-purple-100">
              <button
                onClick={clearCompleted}
                className="w-full py-2 text-sm font-bold text-purple-500 hover:text-white hover:bg-purple-500 rounded-2xl transition-all duration-200 active:scale-95 border-2 border-purple-200 hover:border-purple-500 shadow-sm hover:shadow-lg"
              >
                🗑️ Clear Completed Tasks
              </button>
            </div>
          )}
        </div>

        {/* Footer Message */}
        <div className="mt-4 text-center">
          <p className="text-purple-400 text-xs sm:text-sm font-medium">
            💡 <span className="font-bold">Tip:</span> Click "Start Focus" on any task to begin your 25-minute Pomodoro session! 🍅
          </p>
        </div>
      </div>

      
    </div>
  );
}