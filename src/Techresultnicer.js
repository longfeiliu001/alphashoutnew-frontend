import React from 'react';

const FormattedTextDisplay = ({ text = "" }) => {
  const formatText = (inputText) => {
    if (!inputText) return [];
    
    // Split only on these exact literal patterns: '1. ', '2. ', '3. ', '4. ', '5.'
    const lines = inputText.split(/(?=. 2\. |\. 3\. |\. 4\. |\. 5\.)/);
    
    return lines.map((line) => {
      if (!line.trim()) return null;
      
      // Only match these specific numbers: 1, 2, 3, 4, 5
      const match = line.match(/^([1-5]\.)\s*(.+)$/s);
      if (!match) return null;
      
      const [, number, content] = match;
      
      // Process bold text
      let processedContent = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      
      // Check if content contains ' 2. ', ' 3. ', ' 4. ', ' 5.' patterns
      const hasNumberedPatterns = /( 2\. | 3\. | 4\. | 5\.)/.test(processedContent);
      
      if (hasNumberedPatterns) {
        // Use numbered patterns as line breaks
        processedContent = processedContent.replace(/( 2\. | 3\. | 4\. | 5\.)/g, '<br/>$1');
      } else {
        // Use specific phrases as line breaks
        processedContent = processedContent.replace(/(Technical Trend|Support|MACD|Trading Volume|Suggestion)/g, '<br/>$1');
      }
      
      return {
        number: number.replace('.', ''),
        content: processedContent
      };
    }).filter(Boolean);
  };

  const items = formatText(text);

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      fontFamily: 'Arial, sans-serif'
    },
    itemsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    item: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    },
    badge: {
      width: '28px',
      height: '28px',
      backgroundColor: '#1890ff',
      color: '#ffffff',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '500',
      flexShrink: 0,
      marginTop: '2px'
    },
    content: {
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#333333',
      margin: 0,
      flex: 1
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.itemsContainer}>
        {items.map((item, index) => (
          <div key={index} style={styles.item}>
            <div style={styles.badge}>
              {item.number}
            </div>
            <div 
              style={styles.content}
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default FormattedTextDisplay;