import { useState } from 'react';
import { History as HistoryIcon, Search, Trash2, Calendar, Database, MessageSquare } from 'lucide-react';
import { useQueryStore, QueryHistoryItem } from '../stores/queryStore';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import toast from 'react-hot-toast';

function History() {
  const { history, clearHistory } = useQueryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<QueryHistoryItem | null>(null);
  
  // Load history from localStorage on first render
  useState(() => {
    const savedHistory = localStorage.getItem('query_history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        if (parsedHistory.length > 0 && !selectedItem) {
          setSelectedItem(parsedHistory[0]);
        }
      } catch (e) {
        console.error('Error parsing history:', e);
      }
    }
  });
  
  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      clearHistory();
      setSelectedItem(null);
      toast.success('History cleared');
    }
  };
  
  // Filter history based on search term
  const filteredHistory = searchTerm 
    ? history.filter(item => 
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sql.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : history;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <div className="max-w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center">
          <HistoryIcon size={24} className="mr-2 text-primary" />
          Query History
        </h1>
        
        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="btn btn-outline flex items-center gap-2 text-error hover:bg-error/10"
          >
            <Trash2 size={16} />
            <span>Clear History</span>
          </button>
        )}
      </div>
      
      {history.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <HistoryIcon size={48} className="mx-auto text-foreground/30 mb-4" />
          <h3 className="text-lg font-medium">No Query History</h3>
          <p className="text-foreground/70 mt-2 mb-4">
            Your query history will appear here after you start asking questions
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* History List */}
          <div className="w-full md:w-96 lg:w-1/3 flex-shrink-0">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search history..."
                    className="input w-full pl-9"
                  />
                </div>
              </div>
              
              <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                {filteredHistory.length === 0 ? (
                  <div className="p-4 text-center text-foreground/70">
                    No matching queries found
                  </div>
                ) : (
                  <ul className="divide-y divide-border">
                    {filteredHistory.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => setSelectedItem(item)}
                          className={`w-full text-left p-3 hover:bg-background/80 transition-colors ${
                            selectedItem?.id === item.id ? 'bg-primary/5 text-primary' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium truncate">{item.question}</span>
                          </div>
                          <div className="flex items-center text-xs text-foreground/70">
                            <Calendar size={12} className="mr-1" />
                            <span>{formatDate(item.timestamp)}</span>
                            <span className="mx-2">•</span>
                            <Database size={12} className="mr-1" />
                            <span>{item.results_count} results</span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          
          {/* Query Details */}
          <div className="flex-1">
            {selectedItem ? (
              <div className="bg-card rounded-lg border border-border">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium flex items-center">
                      <MessageSquare size={18} className="mr-2 text-primary" />
                      Query Details
                    </h2>
                    <div className="text-xs px-2 py-1 bg-background rounded-md">
                      {formatDate(selectedItem.timestamp)}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-foreground/70 mb-2">Question</h3>
                    <div className="bg-background p-3 rounded-md border border-border">
                      <p className="text-foreground">{selectedItem.question}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-foreground/70 mb-2">Generated SQL</h3>
                    <SyntaxHighlighter
                      language="sql"
                      style={a11yDark}
                      customStyle={{
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        padding: '1rem',
                      }}
                    >
                      {selectedItem.sql}
                    </SyntaxHighlighter>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-foreground/70 mb-2">Results</h3>
                    <div className="bg-background p-3 rounded-md border border-border">
                      <p className="text-foreground">
                        {selectedItem.results_count} {selectedItem.results_count === 1 ? 'result' : 'results'} found
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center text-foreground/70 text-sm">
                      <Database size={16} className="mr-1" />
                      <span>Connection: {selectedItem.connectionId}</span>
                    </div>
                    
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        // Here you would typically re-run the query
                        toast.success('Feature coming soon: Re-run query');
                      }}
                    >
                      Re-run Query
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <MessageSquare size={48} className="mx-auto text-foreground/30 mb-4" />
                <h3 className="text-lg font-medium">Select a Query</h3>
                <p className="text-foreground/70 mt-2">
                  Choose a query from the history list to view its details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default History;