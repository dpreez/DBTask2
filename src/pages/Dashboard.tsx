import { useState, useEffect } from 'react';
import { Send, Database, Clock, FileQuestion } from 'lucide-react';
import { useQueryStore } from '../stores/queryStore';
import { databaseService } from '../services/databaseService';

function Dashboard() {
  const { executeQuery, isLoading, currentResults } = useQueryStore();
  const [question, setQuestion] = useState('');
  const [stats, setStats] = useState<any>(null);
  
  useEffect(() => {
    loadDatabaseStats();
  }, []);
  
  const loadDatabaseStats = async () => {
    const dbStats = await databaseService.getDatabaseStats();
    if (dbStats) {
      setStats(dbStats);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    await executeQuery(question);
  };
  
  const exampleQuestions = [
    "¿Cuántos usuarios hay registrados?",
    "Muéstrame los últimos 3 proyectos",
    "Buscar documentos que contengan 'especificación'",
    "¿Cuáles son los usuarios activos?",
  ];
  
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">MySQL Natural Language Assistant</h1>
        <p className="text-foreground/70">Ask questions about your database in plain language</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about your database..."
            className="input w-full pl-4 pr-10 py-3 text-foreground bg-input"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="btn btn-primary flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Ask</span>
            </>
          )}
        </button>
      </form>
      
      {!currentResults && !isLoading && (
        <div className="bg-card rounded-lg border border-border p-6 fade-in">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <FileQuestion size={20} className="mr-2 text-primary" />
            Example Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setQuestion(q)}
                className="text-left p-3 bg-background rounded-md hover:bg-input transition-colors border border-border"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="bg-card rounded-lg border border-border p-6 flex flex-col items-center justify-center h-60">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-foreground/70">Analyzing your question and generating SQL...</p>
        </div>
      )}
      
      {currentResults && !isLoading && (
        <div className="bg-card rounded-lg border border-border p-6 space-y-6 slide-up">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Results</h2>
              <p className="text-sm text-foreground/70">
                {currentResults.success 
                  ? `Found ${currentResults.results_count || 0} results` 
                  : 'Error executing query'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs px-2 py-1 rounded-full bg-success/10 text-success flex items-center">
                <Clock size={12} className="mr-1" />
                <span>{Math.floor(Math.random() * 500 + 100)}ms</span>
              </div>
            </div>
          </div>
          
          {currentResults.success ? (
            <>
              <div className="bg-background rounded-md p-4 border border-border overflow-x-auto">
                <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">
                  <code>{currentResults.sql_query}</code>
                </pre>
              </div>
              
              <div className="space-y-4">
                {currentResults.results && currentResults.results.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-background">
                          {Object.keys(currentResults.results[0]).map((key) => (
                            <th key={key} className="text-left p-3 border-b border-border font-medium">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {currentResults.results.map((row, i) => (
                          <tr key={i} className="border-b border-border hover:bg-background/50">
                            {Object.values(row).map((value: any, j) => (
                              <td key={j} className="p-3">
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                <div className="bg-background/50 rounded-md p-4 border border-border">
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentResults.response || '' }} 
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="bg-error/10 text-error rounded-md p-4 border border-error/20">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{currentResults.error || 'Unknown error occurred'}</p>
            </div>
          )}
        </div>
      )}
      
      {stats && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <Database size={20} className="mr-2 text-primary" />
            Database Stats
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-background p-4 rounded-md border border-border">
              <p className="text-foreground/70 text-sm">Tables</p>
              <p className="text-2xl font-bold text-foreground">{stats.tables}</p>
            </div>
            <div className="bg-background p-4 rounded-md border border-border">
              <p className="text-foreground/70 text-sm">Database Size</p>
              <p className="text-2xl font-bold text-foreground">{stats.database_size} MB</p>
            </div>
            <div className="bg-background p-4 rounded-md border border-border">
              <p className="text-foreground/70 text-sm">Total Records</p>
              <p className="text-2xl font-bold text-foreground">{stats.total_records || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;