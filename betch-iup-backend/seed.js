require('dotenv').config();
const User = require('./src/models/User');
const Question = require('./src/models/Question');
const connectDB = require('./src/config/db');

const q = (company, role, difficulty, type, text, sampleAnswer, keywords, options = []) => ({
    company, role, difficulty, type, text, sampleAnswer, evaluationKeywords: keywords, options
});

// ============================================================
// REAL PLACEMENT QUESTIONS - Hard & Medium Only
// Based on actual company interview patterns
// ============================================================
const questions = [

    // ==========================================================
    // TCS - Frontend (NQT Pattern)
    // ==========================================================
    q('TCS', 'Frontend', 'Hard', 'Technical',
        `Write a JavaScript function that implements memoization for any given function.\n\nExample:\nconst slowSquare = n => { for(let i=0;i<1e8;i++); return n*n; };\nconst fastSquare = memoize(slowSquare);\nfastSquare(5); // computed\nfastSquare(5); // from cache`,
        `function memoize(fn) {\n  const cache = {};\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache[key] !== undefined) return cache[key];\n    cache[key] = fn.apply(this, args);\n    return cache[key];\n  };\n}`,
        ['cache', 'JSON.stringify', 'closure', 'memoize', 'args']),

    q('TCS', 'Frontend', 'Hard', 'Technical',
        `Implement a function groupBy(array, key) that groups objects by a given key.\n\nInput: [{type:'A',val:1},{type:'B',val:2},{type:'A',val:3}], 'type'\nOutput: { A:[{type:'A',val:1},{type:'A',val:3}], B:[{type:'B',val:2}] }`,
        `function groupBy(arr, key) {\n  return arr.reduce((acc, obj) => {\n    const k = obj[key];\n    if (!acc[k]) acc[k] = [];\n    acc[k].push(obj);\n    return acc;\n  }, {});\n}`,
        ['reduce', 'accumulator', 'key', 'group', 'object']),

    q('TCS', 'Frontend', 'Medium', 'Technical',
        `You are given a string with nested parentheses. Write a function to find the maximum depth of nesting.\n\nInput: "(1+(2*3)+((8)/4))+1"\nOutput: 3`,
        `function maxDepth(s) {\n  let max=0,depth=0;\n  for(const c of s) {\n    if(c==='(') { depth++; max=Math.max(max,depth); }\n    else if(c===')') depth--;\n  }\n  return max;\n}`,
        ['depth', 'counter', 'parentheses', 'loop', 'max']),

    q('TCS', 'Frontend', 'Medium', 'Aptitude',
        `In a group of 6 people, every person shakes hand with every other person exactly once. How many handshakes occur total?`,
        '15', ['15'], ['12', '15', '18', '21']),

    q('TCS', 'Frontend', 'Hard', 'Aptitude',
        `A series: 2, 6, 12, 20, 30, ? follows a pattern. Identify the next number.`,
        '42', ['42'], ['36', '40', '42', '44']),

    q('TCS', 'Frontend', 'Medium', 'HR',
        `You find that one of your team members is submitting their work late repeatedly, affecting the whole team's timeline. How do you handle this without damaging the team relationship?`,
        `I would have a private, non-confrontational conversation to understand if they have blockers, offer help, and if it continues, loop in the manager with specific data and timelines.`,
        ['private', 'conversation', 'blockers', 'manager', 'data', 'timeline']),

    // ==========================================================
    // TCS - Backend
    // ==========================================================
    q('TCS', 'Backend', 'Hard', 'Technical',
        `Design a system to generate unique short URLs from long URLs (URL Shortener).\nExplain your approach for:\n1. Generating unique IDs\n2. Database schema\n3. Redirecting users efficiently`,
        `Use Base62 encoding of an auto-incremented ID. Store {short_id, long_url, created_at} in a DB. Use a hash map / Redis cache for O(1) lookups. Handle collisions via retry with incremented counter.`,
        ['Base62', 'auto-increment', 'Redis', 'cache', 'O(1)', 'hash', 'collision']),

    q('TCS', 'Backend', 'Hard', 'Technical',
        `Write a Node.js middleware function that rate-limits requests to max 10 per minute per IP address. Do NOT use external libraries.`,
        `const store = {};\nfunction rateLimiter(req,res,next){\n  const ip=req.ip, now=Date.now(), window=60000;\n  if(!store[ip]) store[ip]=[];\n  store[ip]=store[ip].filter(t=>now-t<window);\n  if(store[ip].length>=10) return res.status(429).json({error:'Too many requests'});\n  store[ip].push(now);\n  next();\n}`,
        ['timestamp', 'filter', 'window', '429', 'IP', 'array', 'Date.now']),

    q('TCS', 'Backend', 'Hard', 'Aptitude',
        `Given a database table EMPLOYEE(id, name, salary, department_id), write a SQL query to find the second highest salary.`,
        'SELECT MAX(salary) FROM EMPLOYEE WHERE salary < (SELECT MAX(salary) FROM EMPLOYEE);',
        ['MAX', 'subquery', 'salary', 'second', 'WHERE']),

    q('TCS', 'Backend', 'Medium', 'Aptitude',
        `A REST API endpoint returns 403. What does this status code mean?`,
        'Forbidden — the user is authenticated but does not have permission to access the resource.',
        ['forbidden', 'authenticated', 'permission', '403'],
        ['Not Found', 'Unauthorized', 'Forbidden', 'Server Error']),

    q('TCS', 'Backend', 'Hard', 'HR',
        `Tell me about the most technically complex project you have built. Walk me through the architecture, key decisions, and what you would do differently.`,
        `Describe a real project with clear architecture explanation, mention specific technology choices and trade-offs, and show self-awareness by discussing improvements.`,
        ['architecture', 'trade-offs', 'technology', 'decision', 'improve', 'complex']),

    // ==========================================================
    // TCS - Data Analyst
    // ==========================================================
    q('TCS', 'Data Analyst', 'Hard', 'Technical',
        `Write a SQL query to find all customers who have placed orders in EVERY month of 2024.\n\nTables: customers(id, name), orders(id, customer_id, order_date)`,
        `SELECT customer_id FROM orders WHERE YEAR(order_date)=2024 GROUP BY customer_id HAVING COUNT(DISTINCT MONTH(order_date))=12;`,
        ['GROUP BY', 'HAVING', 'COUNT', 'DISTINCT', 'MONTH', 'YEAR', '12']),

    q('TCS', 'Data Analyst', 'Hard', 'Technical',
        `Explain the difference between RANK(), DENSE_RANK(), and ROW_NUMBER() with an example. When would each be preferred?`,
        `ROW_NUMBER: unique sequential. RANK: gaps on ties (1,1,3). DENSE_RANK: no gaps on ties (1,1,2). Use DENSE_RANK for leaderboards.`,
        ['RANK', 'DENSE_RANK', 'ROW_NUMBER', 'ties', 'gaps', 'window function']),

    q('TCS', 'Data Analyst', 'Hard', 'Aptitude',
        `Table SALES has columns: region, month, revenue. Write a query to show each region's revenue as a % of total revenue.`,
        'SELECT region, revenue, ROUND(revenue * 100.0 / SUM(revenue) OVER (), 2) AS pct FROM SALES;',
        ['SUM OVER', 'window', 'percentage', 'ROUND', 'total']),

    q('TCS', 'Data Analyst', 'Medium', 'HR',
        `You discover that a key business metric dashboard has been showing incorrect data for 3 months. How do you approach this situation?`,
        `Immediately flag it to stakeholders, quantify the impact, identify the root cause (pipeline bug, schema change), fix and backfill, and add monitoring to prevent recurrence.`,
        ['stakeholders', 'impact', 'root cause', 'fix', 'backfill', 'monitoring']),

    // ==========================================================
    // INFOSYS - Frontend
    // ==========================================================
    q('Infosys', 'Frontend', 'Hard', 'Technical',
        `Implement a function that deeply compares two objects and returns true if they are equal (including nested objects and arrays).\n\ndeepEqual({a:{b:1}}, {a:{b:1}}) // true\ndeepEqual({a:1}, {a:2}) // false`,
        `function deepEqual(a,b){\n  if(a===b) return true;\n  if(typeof a!==typeof b||a===null||b===null) return false;\n  const ka=Object.keys(a), kb=Object.keys(b);\n  if(ka.length!==kb.length) return false;\n  return ka.every(k=>deepEqual(a[k],b[k]));\n}`,
        ['recursion', 'Object.keys', 'typeof', 'every', 'nested', 'compare']),

    q('Infosys', 'Frontend', 'Hard', 'Technical',
        `Explain the difference between microtasks and macrotasks in the JavaScript event loop. What is the execution order of:\nconsole.log('1');\nsetTimeout(()=>console.log('2'),0);\nPromise.resolve().then(()=>console.log('3'));\nconsole.log('4');`,
        `Output: 1, 4, 3, 2. Synchronous code runs first (1,4). Then microtasks like Promise callbacks (3). Then macrotasks like setTimeout (2).`,
        ['microtask', 'macrotask', 'Promise', 'setTimeout', 'synchronous', 'execution order', 'event loop']),

    q('Infosys', 'Frontend', 'Medium', 'Aptitude',
        `What is the output?\nlet x = 10;\n(function() { console.log(x); var x = 20; })();`,
        'undefined — due to var hoisting inside the IIFE, x is declared but not yet assigned.',
        ['undefined'], ['20', '10', 'undefined', 'ReferenceError']),

    q('Infosys', 'Frontend', 'Hard', 'Aptitude',
        `A webpage loads slowly. You open DevTools and see Time to First Byte (TTFB) is 3 seconds. What are the most likely causes and fixes?`,
        'Server processing time is high. Fix: optimize DB queries, add caching (Redis), use a CDN, enable server-side compression.',
        ['TTFB', 'server', 'caching', 'Redis', 'CDN', 'compression', 'database']),

    q('Infosys', 'Frontend', 'Medium', 'HR',
        `You are assigned to maintain old legacy code with no documentation. How do you approach this?`,
        `I would read the code, run it to understand behavior, write tests to document current behavior, then incrementally refactor with confidence.`,
        ['tests', 'legacy', 'refactor', 'document', 'incremental', 'behavior']),

    // ==========================================================
    // INFOSYS - Backend
    // ==========================================================
    q('Infosys', 'Backend', 'Hard', 'Technical',
        `You have a table with 10 million rows and a slow query:\nSELECT * FROM orders WHERE customer_email = 'x@y.com';\nHow would you optimize it step by step?`,
        `1. Add index on customer_email. 2. Select only needed columns, not *. 3. Partition table by date. 4. Add query cache. 5. Denormalize if needed.`,
        ['index', 'partition', 'cache', 'columns', 'denormalize', 'slow query']),

    q('Infosys', 'Backend', 'Hard', 'Technical',
        `What is the N+1 query problem in ORMs? Give an example and explain how to fix it.`,
        `N+1: fetching 1 list then N queries for each item. Fix: use eager loading (JOIN or include). In Mongoose: use .populate(). In Sequelize: use { include: [...] }.`,
        ['N+1', 'eager loading', 'JOIN', 'populate', 'include', 'ORM']),

    q('Infosys', 'Backend', 'Hard', 'Aptitude',
        `Explain the CAP theorem and give a real-world example for each combination (CP, AP, CA).`,
        `CP: HBase (consistent+partition-tolerant, can be unavailable). AP: Cassandra (always available, eventually consistent). CA: traditional RDBMS (consistent+available but can't handle partitions).`,
        ['CAP', 'consistency', 'availability', 'partition', 'HBase', 'Cassandra', 'RDBMS']),

    q('Infosys', 'Backend', 'Medium', 'Aptitude',
        `In microservices, how do services communicate synchronously vs asynchronously?`,
        'Synchronous: REST, gRPC (direct call, wait for response). Asynchronous: message queues like Kafka/RabbitMQ (fire-and-forget).',
        ['REST', 'gRPC', 'Kafka', 'RabbitMQ', 'synchronous', 'asynchronous', 'queue'],
        ['Only REST', 'Only gRPC', 'REST/gRPC sync, queues async', 'All are synchronous']),

    q('Infosys', 'Full Stack Developer', 'Hard', 'Technical',
        `Design the backend API for a real-time collaborative document editor (like Google Docs). What technologies and patterns would you use?`,
        `Use WebSockets for real-time sync. Operational Transformation (OT) or CRDTs to handle concurrent edits. Redis PubSub for broadcasting changes. MongoDB for document persistence. JWT for auth.`,
        ['WebSocket', 'Operational Transformation', 'CRDT', 'Redis', 'PubSub', 'concurrent', 'real-time']),

    // ==========================================================
    // WIPRO
    // ==========================================================
    q('Wipro', 'Frontend', 'Hard', 'Technical',
        `Implement a custom Promise.all() from scratch that takes an array of promises and resolves when all resolve, or rejects on the first rejection.`,
        `function promiseAll(promises){\n  return new Promise((resolve,reject)=>{\n    const results=[]; let count=0;\n    promises.forEach((p,i)=>{\n      Promise.resolve(p).then(val=>{\n        results[i]=val;\n        if(++count===promises.length) resolve(results);\n      }).catch(reject);\n    });\n  });\n}`,
        ['Promise', 'resolve', 'reject', 'counter', 'forEach', 'results']),

    q('Wipro', 'Frontend', 'Hard', 'Aptitude',
        `What does "event bubbling" mean, and how does it differ from "event capturing"? Give a real scenario where you would use each.`,
        `Bubbling: events propagate from child to parent. Capturing: parent to child. Use capturing for global keyboard shortcuts, bubbling for event delegation (one listener for many children).`,
        ['bubbling', 'capturing', 'propagation', 'delegation', 'parent', 'child']),

    q('Wipro', 'Backend', 'Hard', 'Technical',
        `Write a function in JavaScript/Python to find all permutations of a string.\n\nInput: "ABC"\nOutput: ["ABC","ACB","BAC","BCA","CAB","CBA"]`,
        `function permutations(str){\n  if(str.length<=1) return [str];\n  return str.split('').flatMap((c,i)=>{\n    const rest=str.slice(0,i)+str.slice(i+1);\n    return permutations(rest).map(p=>c+p);\n  });\n}`,
        ['recursion', 'flatMap', 'backtracking', 'permutations', 'base case']),

    q('Wipro', 'Backend', 'Hard', 'Aptitude',
        `What is the difference between optimistic and pessimistic locking in database transactions? When do you use each?`,
        `Optimistic: assume no conflict, check on commit (good for low-contention reads). Pessimistic: lock row on read (good for high-contention updates like bank transfers).`,
        ['optimistic', 'pessimistic', 'lock', 'conflict', 'contention', 'transaction'],
        ['Pessimistic is always faster', 'Optimistic locks on read', 'Optimistic assumes no conflict, checks on commit', 'They are the same']),

    q('Wipro', 'Data Analyst', 'Hard', 'Technical',
        `Write a SQL query to calculate a 7-day rolling average of daily sales.\n\nTable: daily_sales(sale_date DATE, revenue DECIMAL)`,
        `SELECT sale_date, AVG(revenue) OVER (ORDER BY sale_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS rolling_avg FROM daily_sales;`,
        ['AVG', 'OVER', 'ROWS BETWEEN', 'PRECEDING', 'rolling', 'window function']),

    // ==========================================================
    // AMAZON
    // ==========================================================
    q('Amazon', 'Frontend', 'Hard', 'Technical',
        `Implement a virtual scrolling list in JavaScript. Given 100,000 items, only render the ones visible in the viewport.\n\nExplain your approach, then write the core logic.`,
        `Track scrollTop and viewportHeight. Calculate startIndex = Math.floor(scrollTop/itemHeight), endIndex = startIndex + visibleCount + buffer. Only render items between startIndex and endIndex. Offset container with paddingTop.`,
        ['startIndex', 'scrollTop', 'itemHeight', 'viewport', 'render', 'buffer', 'paddingTop']),

    q('Amazon', 'Frontend', 'Hard', 'Technical',
        `You have an array of intervals like [[1,3],[2,6],[8,10],[15,18]]. Write a function to merge all overlapping intervals.\n\nOutput: [[1,6],[8,10],[15,18]]`,
        `function merge(intervals){\n  intervals.sort((a,b)=>a[0]-b[0]);\n  const res=[intervals[0]];\n  for(let i=1;i<intervals.length;i++){\n    const last=res[res.length-1];\n    if(intervals[i][0]<=last[1]) last[1]=Math.max(last[1],intervals[i][1]);\n    else res.push(intervals[i]);\n  }\n  return res;\n}`,
        ['sort', 'overlap', 'merge', 'max', 'intervals']),

    q('Amazon', 'SDE I', 'Hard', 'Technical',
        `Given a string, find the length of the longest substring without repeating characters.\n\nInput: "abcabcbb" → Output: 3 ("abc")\nInput: "pwwkew" → Output: 3 ("wke")`,
        `function lengthOfLongestSubstring(s){\n  const map={}; let max=0, left=0;\n  for(let r=0;r<s.length;r++){\n    if(map[s[r]]>=left) left=map[s[r]]+1;\n    map[s[r]]=r;\n    max=Math.max(max,r-left+1);\n  }\n  return max;\n}`,
        ['sliding window', 'hashmap', 'left pointer', 'right pointer', 'max', 'substring']),

    q('Amazon', 'SDE I', 'Hard', 'Technical',
        `Given an array of integers, return the indices of the two numbers that add up to a target.\n\nInput: [2, 7, 11, 15], target=9 → Output: [0, 1]\nConstraint: O(n) time`,
        `function twoSum(nums,target){\n  const map={};\n  for(let i=0;i<nums.length;i++){\n    const comp=target-nums[i];\n    if(map[comp]!==undefined) return [map[comp],i];\n    map[nums[i]]=i;\n  }\n}`,
        ['hashmap', 'complement', 'O(n)', 'index', 'target']),

    q('Amazon', 'SDE I', 'Hard', 'Aptitude',
        `You have a system serving 1 million requests/day. The average response time suddenly increases from 50ms to 500ms. Walk through your debugging methodology.`,
        `Check monitoring: CPU/memory/DB. Look at recent deployments. Profile slow endpoints. Check DB query plans and locks. Look for N+1 queries. Check external dependencies (3rd party APIs). Add tracing with correlation IDs.`,
        ['monitoring', 'CPU', 'DB', 'deployment', 'profile', 'N+1', 'tracing', 'correlation']),

    q('Amazon', 'Data Analyst', 'Hard', 'Technical',
        `Write a SQL query to find customers who bought product A but NOT product B.\n\nTables: customers(id), orders(customer_id, product_name)`,
        `SELECT DISTINCT customer_id FROM orders WHERE product_name='A'\nAND customer_id NOT IN (SELECT customer_id FROM orders WHERE product_name='B');`,
        ['NOT IN', 'subquery', 'DISTINCT', 'customer_id', 'product']),

    // ==========================================================
    // GOOGLE
    // ==========================================================
    q('Google', 'Software Engineer', 'Hard', 'Technical',
        `Implement a function to find the kth largest element in an unsorted array without fully sorting it.\n\nInput: [3,2,1,5,6,4], k=2 → Output: 5\nExpected: O(n) average using QuickSelect`,
        `function findKthLargest(nums,k){\n  const pivot=nums[Math.floor(Math.random()*nums.length)];\n  const big=nums.filter(n=>n>pivot);\n  const equal=nums.filter(n=>n===pivot);\n  const small=nums.filter(n=>n<pivot);\n  if(k<=big.length) return findKthLargest(big,k);\n  if(k<=big.length+equal.length) return pivot;\n  return findKthLargest(small,k-big.length-equal.length);\n}`,
        ['QuickSelect', 'pivot', 'partition', 'kth', 'O(n)', 'filter']),

    q('Google', 'Software Engineer', 'Hard', 'Technical',
        `Design a Least Recently Used (LRU) Cache with O(1) get and put operations.\n\nImplement get(key) and put(key, value).`,
        `Use a doubly linked list + a hashmap. Map stores key→node. List maintains order. On get: move node to front. On put: add to front; if over capacity, remove tail. All O(1).`,
        ['doubly linked list', 'hashmap', 'O(1)', 'evict', 'tail', 'front', 'LRU']),

    q('Google', 'Software Engineer', 'Hard', 'Aptitude',
        `Given an array [1,2,0,3,0,4,0], move all zeros to the end while maintaining order of non-zero elements. Do it in-place with O(1) extra space.\n\nOutput: [1,2,3,4,0,0,0]`,
        `function moveZeros(nums){\n  let pos=0;\n  for(let i=0;i<nums.length;i++){\n    if(nums[i]!==0) nums[pos++]=nums[i];\n  }\n  while(pos<nums.length) nums[pos++]=0;\n}`,
        ['in-place', 'pointer', 'O(1)', 'maintain order', 'two-pass']),

    q('Google', 'Frontend Engineer', 'Hard', 'Technical',
        `Explain the Critical Rendering Path in browsers. How does it affect web performance, and what are the top 3 techniques to optimize it?`,
        `CRP: HTML parsing → DOM, CSS parsing → CSSOM, render tree, layout, paint. Optimize: 1) Defer/async non-critical JS. 2) Minify CSS, inline critical CSS. 3) Lazy load images below the fold.`,
        ['CRP', 'DOM', 'CSSOM', 'defer', 'async', 'critical CSS', 'lazy load', 'paint', 'layout']),

    q('Google', 'Data Analyst', 'Hard', 'Technical',
        `You have a users table and an events table (user_id, event_type, event_time). Write a query to find the conversion rate: users who did 'signup' followed by 'purchase' within 7 days.`,
        `SELECT COUNT(DISTINCT s.user_id)*100.0/COUNT(DISTINCT s.user_id) FROM events s JOIN events p ON s.user_id=p.user_id WHERE s.event_type='signup' AND p.event_type='purchase' AND p.event_time BETWEEN s.event_time AND DATE_ADD(s.event_time,INTERVAL 7 DAY);`,
        ['JOIN', 'BETWEEN', 'DATE_ADD', 'funnel', 'conversion', 'event_type']),

    // ==========================================================
    // MICROSOFT
    // ==========================================================
    q('Microsoft', 'Software Engineer', 'Hard', 'Technical',
        `Implement a function to find all valid combinations of parentheses for n pairs.\n\nInput: 3\nOutput: ["((()))","(()())","(())()","()(())","()()()"]`,
        `function generateParenthesis(n){\n  const res=[];\n  function bt(cur,open,close){\n    if(cur.length===2*n){ res.push(cur); return; }\n    if(open<n) bt(cur+'(',open+1,close);\n    if(close<open) bt(cur+')',open,close+1);\n  }\n  bt('',0,0); return res;\n}`,
        ['backtracking', 'recursion', 'open', 'close', 'valid', 'parentheses']),

    q('Microsoft', 'Software Engineer', 'Hard', 'Technical',
        `You are given a matrix of 0s and 1s. Find the number of distinct islands (connected groups of 1s, connected horizontally or vertically).\n\nInput: [[1,1,0],[0,1,0],[0,0,1]] → Output: 2`,
        `function countIslands(grid){\n  let count=0;\n  function dfs(i,j){\n    if(i<0||j<0||i>=grid.length||j>=grid[0].length||grid[i][j]===0) return;\n    grid[i][j]=0;\n    dfs(i+1,j);dfs(i-1,j);dfs(i,j+1);dfs(i,j-1);\n  }\n  for(let i=0;i<grid.length;i++)\n    for(let j=0;j<grid[0].length;j++)\n      if(grid[i][j]===1){dfs(i,j);count++;}\n  return count;\n}`,
        ['DFS', 'BFS', 'grid', 'matrix', 'connected', 'island', 'recursion']),

    q('Microsoft', 'Frontend Engineer', 'Hard', 'Technical',
        `Implement a pub/sub (publish/subscribe) event system in JavaScript with on(), off(), and emit() methods.`,
        `class EventEmitter{\n  constructor(){ this.events={}; }\n  on(e,fn){ (this.events[e]??=[]).push(fn); }\n  off(e,fn){ this.events[e]=this.events[e]?.filter(f=>f!==fn); }\n  emit(e,...args){ this.events[e]?.forEach(fn=>fn(...args)); }\n}`,
        ['pub/sub', 'on', 'off', 'emit', 'events', 'filter', 'EventEmitter']),

    q('Microsoft', 'Software Engineer', 'Hard', 'Aptitude',
        `You have one red and one blue marker. There are 100 coins in a row, numbered 1-100. You can flip a coin if the number is divisible by 2 (red marker) or 3 (blue marker). How many coins get flipped an odd number of times?`,
        `Coins divisible by 2 or 3 but not both (not by 6): |div2|+|div3|-2*|div6| = 50+33-2*16 = 51. So 51 coins are flipped an odd number of times.`,
        ['divisor', 'modulo', 'inclusion-exclusion', 'LCM', 'odd', 'even']),

    q('Microsoft', 'Data Analyst', 'Hard', 'Technical',
        `Write a SQL query to detect fraudulent transactions: find any customer who made more than 3 transactions in a single hour.\n\nTable: transactions(id, customer_id, amount, created_at)`,
        `SELECT customer_id, DATE_FORMAT(created_at,'%Y-%m-%d %H') as hour, COUNT(*) as txn_count FROM transactions GROUP BY customer_id, hour HAVING COUNT(*) > 3;`,
        ['GROUP BY', 'HAVING', 'DATE_FORMAT', 'HOUR', 'COUNT', 'fraud']),

    // ==========================================================
    // ZOHO
    // ==========================================================
    q('Zoho', 'Frontend', 'Hard', 'Technical',
        `Implement a deep clone function for any JavaScript value (objects, arrays, primitives, dates, functions).`,
        `function deepClone(val){\n  if(val===null||typeof val!=='object') return val;\n  if(val instanceof Date) return new Date(val);\n  if(Array.isArray(val)) return val.map(deepClone);\n  return Object.fromEntries(Object.entries(val).map(([k,v])=>[k,deepClone(v)]));\n}`,
        ['instanceof', 'Date', 'Array.isArray', 'Object.entries', 'recursion', 'primitive']),

    q('Zoho', 'Backend', 'Hard', 'Technical',
        `Write a function to flatten a deeply nested JavaScript object into a single-level object with dot-notation keys.\n\nInput: {a:{b:{c:1}},d:2}\nOutput: {'a.b.c':1, d:2}`,
        `function flatten(obj,prefix='',result={}){\n  for(const [key,val] of Object.entries(obj)){\n    const fullKey=prefix?prefix+'.'+key:key;\n    if(typeof val==='object'&&val!==null&&!Array.isArray(val))\n      flatten(val,fullKey,result);\n    else result[fullKey]=val;\n  }\n  return result;\n}`,
        ['recursion', 'dot-notation', 'Object.entries', 'prefix', 'flatten', 'nested']),

    q('Zoho', 'Backend', 'Hard', 'Aptitude',
        `You receive a bug report: users in one country see wrong prices (they see USD prices instead of their local currency). You have 30 minutes before a critical demo. What do you do?`,
        `Immediately hotfix: add a country→currency guard in the pricing service. Test on staging. Deploy with feature flag. Communicate to stakeholders. Post-mortem to fix root cause.`,
        ['hotfix', 'feature flag', 'staging', 'stakeholder', 'currency', 'guard', 'post-mortem']),

    q('Zoho', 'Data Analyst', 'Hard', 'Technical',
        `Write a SQL query to find the running total of orders per customer, ordered by order_date.\n\nTable: orders(customer_id, order_date, amount)`,
        `SELECT customer_id, order_date, amount, SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_date) AS running_total FROM orders;`,
        ['SUM OVER', 'PARTITION BY', 'ORDER BY', 'running total', 'window function']),

    // ==========================================================
    // HCL TECHNOLOGIES
    // ==========================================================
    q('HCL Technologies', 'Frontend', 'Hard', 'Technical',
        `Write a JavaScript function that converts a flat array of nodes into a nested tree structure.\n\nInput: [{id:1,parentId:null},{id:2,parentId:1},{id:3,parentId:1},{id:4,parentId:2}]\nOutput: [{id:1,children:[{id:2,children:[{id:4}]},{id:3}]}]`,
        `function buildTree(nodes){\n  const map={};\n  nodes.forEach(n=>map[n.id]={...n,children:[]});\n  const roots=[];\n  nodes.forEach(n=>{\n    if(n.parentId===null) roots.push(map[n.id]);\n    else map[n.parentId].children.push(map[n.id]);\n  });\n  return roots;\n}`,
        ['map', 'parentId', 'children', 'tree', 'flatten-to-tree', 'recursion']),

    q('HCL Technologies', 'Frontend', 'Hard', 'Aptitude',
        `What happens when you type a URL in the browser and press Enter? Describe all steps in order.`,
        `DNS lookup → TCP connection (3-way handshake) → TLS/SSL handshake (if HTTPS) → HTTP request → Server processes and responds → Browser parses HTML → Loads CSS/JS → Renders page.`,
        ['DNS', 'TCP', 'TLS', 'HTTP', 'request', 'response', 'parse', 'render', 'handshake']),

    q('HCL Technologies', 'Backend', 'Hard', 'Technical',
        `Explain connection pooling in databases. Why is it critical in a high-traffic Node.js application?`,
        `Connection pooling reuses existing DB connections instead of creating new ones for each request. Without it, a spike in traffic would overwhelm the DB with connection overhead. Mongoose/pg use pools automatically.`,
        ['pool', 'reuse', 'connection', 'overhead', 'spike', 'traffic', 'Mongoose']),

    q('HCL Technologies', 'Backend', 'Medium', 'HR',
        `Your team is asked to deliver a major feature in half the usual time. You know it requires cutting corners on code quality. How do you handle this?`,
        `Negotiate scope: identify the 20% of features that deliver 80% of value. Agree on tech debt documentation and a scheduled refactor. Ensure unit tests are not skipped.`,
        ['scope', 'negotiate', 'tech debt', '80/20', 'refactor', 'tests', 'quality']),

    // ==========================================================
    // COGNIZANT
    // ==========================================================
    q('Cognizant', 'Frontend', 'Hard', 'Technical',
        `Implement a function that takes a number and returns its Roman numeral representation.\n\nInput: 1994 → Output: "MCMXCIV"`,
        `function toRoman(num){\n  const vals=[1000,900,500,400,100,90,50,40,10,9,5,4,1];\n  const syms=["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];\n  let res="";\n  vals.forEach((v,i)=>{ while(num>=v){res+=syms[i];num-=v;} });\n  return res;\n}`,
        ['greedy', 'Roman', 'modulo', 'while', 'array', 'map']),

    q('Cognizant', 'Backend', 'Hard', 'Technical',
        `Design a notification service that sends alerts via Email, SMS, and Push Notification. How would you ensure delivery reliability and avoid duplicate sends?`,
        `Use a queue (Kafka/SQS) per channel. Each worker consumes and sends, marking messages as "sent" in DB. Use idempotency keys (generated from userId+notificationId) to deduplicate. Retry with exponential backoff.`,
        ['queue', 'Kafka', 'SQS', 'idempotency', 'deduplication', 'retry', 'exponential backoff']),

    q('Cognizant', 'Data Analyst', 'Hard', 'Technical',
        `You have sales data for 3 years. Write a SQL query to find months where sales dropped more than 20% compared to the previous month.`,
        `Use LAG() window function: SELECT month, revenue, LAG(revenue) OVER (ORDER BY month) AS prev, (revenue-LAG(revenue) OVER (ORDER BY month))/LAG(revenue) OVER (ORDER BY month)*100 AS pct_change FROM monthly_sales HAVING pct_change < -20;`,
        ['LAG', 'window function', 'percentage', 'drop', 'previous', 'month']),

    // ==========================================================
    // ACCENTURE
    // ==========================================================
    q('Accenture', 'Frontend', 'Hard', 'Technical',
        `Write a function that implements the observer pattern in JavaScript. A subject should be able to have multiple observers that get notified on state changes.`,
        `class Subject{\n  constructor(){this.observers=[];this.state=null;}\n  subscribe(obs){this.observers.push(obs);}\n  unsubscribe(obs){this.observers=this.observers.filter(o=>o!==obs);}\n  setState(state){this.state=state;this.observers.forEach(o=>o.update(state));}\n}`,
        ['observer', 'subscribe', 'unsubscribe', 'notify', 'state', 'pattern', 'filter']),

    q('Accenture', 'Backend', 'Hard', 'Technical',
        `What is the difference between horizontal and vertical scaling? Design a strategy to scale a Node.js API handling 50,000 concurrent users.`,
        `Vertical: bigger machine. Horizontal: more machines (preferred). For Node.js: Use PM2 cluster mode, load balancer (Nginx), Redis for session sharing, DB read replicas, CDN for static assets.`,
        ['horizontal', 'vertical', 'PM2', 'cluster', 'Nginx', 'Redis', 'replica', 'CDN']),

    q('Accenture', 'Full Stack Developer', 'Hard', 'Technical',
        `Implement JWT-based authentication in a Node.js/Express application. Include: registration, login, and a protected route middleware.`,
        `1. Register: hash password with bcrypt, save user. 2. Login: compare password, sign JWT. 3. Middleware: verify token from Authorization header, attach user to req. 4. Protect routes by applying middleware.`,
        ['JWT', 'bcrypt', 'sign', 'verify', 'middleware', 'Authorization', 'protected route']),

    // ==========================================================
    // FLIPKART
    // ==========================================================
    q('Flipkart', 'Software Engineer', 'Hard', 'Technical',
        `Given a binary tree, find the lowest common ancestor (LCA) of two given nodes.\n\nInput: root=[3,5,1,6,2,0,8], p=5, q=1 → Output: 3`,
        `function lca(root,p,q){\n  if(!root||root===p||root===q) return root;\n  const left=lca(root.left,p,q);\n  const right=lca(root.right,p,q);\n  if(left&&right) return root;\n  return left||right;\n}`,
        ['LCA', 'binary tree', 'recursion', 'left', 'right', 'ancestor']),

    q('Flipkart', 'Frontend Engineer', 'Hard', 'Technical',
        `You are building a product listing page for 10,000 products. The page is slow. List 5 concrete optimizations you would implement on the frontend.`,
        `1. Virtual scrolling (render only visible items). 2. Debounce search/filter. 3. Lazy load images (IntersectionObserver). 4. Memoize filter/sort computations. 5. Code-split with React.lazy. 6. Use service worker for caching.`,
        ['virtual scroll', 'debounce', 'lazy load', 'memoize', 'code split', 'service worker', 'IntersectionObserver']),

    q('Flipkart', 'Data Analyst', 'Hard', 'Technical',
        `Write a SQL query to find the top 3 best-selling products per category, by total revenue.\n\nTables: products(id, name, category), order_items(product_id, quantity, price)`,
        `SELECT * FROM (\n  SELECT p.category, p.name, SUM(oi.quantity*oi.price) AS revenue,\n  RANK() OVER (PARTITION BY p.category ORDER BY SUM(oi.quantity*oi.price) DESC) AS rnk\n  FROM products p JOIN order_items oi ON p.id=oi.product_id\n  GROUP BY p.category, p.name\n) ranked WHERE rnk<=3;`,
        ['RANK', 'PARTITION BY', 'revenue', 'top 3', 'JOIN', 'GROUP BY']),

    // ==========================================================
    // SWIGGY
    // ==========================================================
    q('Swiggy', 'Software Engineer', 'Hard', 'Technical',
        `Design the data model for Swiggy: restaurants, menus, orders, and delivery tracking. What database(s) would you use and why?`,
        `Restaurants/Menus: PostgreSQL (relational, ACID). Orders: MongoDB (flexible document, high write). Delivery tracking: Redis (real-time lat/lng). Use Kafka to decouple order events from delivery events.`,
        ['PostgreSQL', 'MongoDB', 'Redis', 'Kafka', 'ACID', 'relational', 'real-time', 'decouple']),

    q('Swiggy', 'Backend', 'Hard', 'Technical',
        `Implement a function to calculate the estimated delivery time based on: restaurant prep time, delivery distance, and current traffic multiplier.\n\nWrite a clean, testable function with error handling.`,
        `function calcETA(prepMins, distanceKm, trafficMultiplier=1.0){\n  if(prepMins<0||distanceKm<0) throw new Error('Invalid input');\n  const AVG_SPEED_KMH=20;\n  const deliveryMins=(distanceKm/AVG_SPEED_KMH)*60*trafficMultiplier;\n  return Math.ceil(prepMins+deliveryMins);\n}`,
        ['function', 'error handling', 'testable', 'multiplier', 'ceil', 'speed', 'ETA']),

    q('Swiggy', 'Backend', 'Hard', 'HR',
        `Swiggy processes 5 million orders daily and you are asked to reduce order processing latency by 30%. How would you approach this in 3 months?`,
        `Month 1: Measure and profile — find top 3 bottlenecks (likely DB, 3rd party APIs, synchronous chains). Month 2: Optimize — add caching, async queues, DB indexes. Month 3: Validate with load testing, deploy canary.`,
        ['profile', 'bottleneck', 'cache', 'async', 'queue', 'index', 'canary', 'load test']),

    // ==========================================================
    // ZOMATO
    // ==========================================================
    q('Zomato', 'Software Engineer', 'Hard', 'Technical',
        `Implement a function to find the longest palindromic substring in a string.\n\nInput: "babad" → Output: "bab" or "aba"\nInput: "cbbd" → Output: "bb"`,
        `function longestPalindrome(s){\n  let res='';\n  for(let i=0;i<s.length;i++){\n    for(const [l,r] of [[i,i],[i,i+1]]){\n      let lo=l,ri=r;\n      while(lo>=0&&ri<s.length&&s[lo]===s[ri]){lo--;ri++;}\n      if(ri-lo-1>res.length) res=s.slice(lo+1,ri);\n    }\n  }\n  return res;\n}`,
        ['palindrome', 'expand center', 'substring', 'longest', 'two pointers']),

    q('Zomato', 'Data Analyst', 'Hard', 'Technical',
        `You are analyzing restaurant ratings. Write a SQL query to find restaurants whose average rating this month improved by more than 0.5 compared to last month.`,
        `SELECT r.id, r.name, AVG(CASE WHEN MONTH(review_date)=MONTH(CURDATE()) THEN rating END) AS this_month,\nAVG(CASE WHEN MONTH(review_date)=MONTH(CURDATE())-1 THEN rating END) AS last_month\nFROM restaurants r JOIN reviews rv ON r.id=rv.restaurant_id\nGROUP BY r.id HAVING this_month-last_month>0.5;`,
        ['CASE WHEN', 'MONTH', 'AVG', 'HAVING', 'conditional aggregation', 'improve']),

    // ==========================================================
    // PAYTM
    // ==========================================================
    q('Paytm', 'Software Engineer', 'Hard', 'Technical',
        `Design a wallet system that handles concurrent debit and credit operations safely.\n\nKey requirements: atomicity, no double deductions, support for millions of users.`,
        `Use DB transactions with row-level locking (SELECT FOR UPDATE). Use optimistic locking with version field. Use Redis atomic operations (INCRBYFLOAT) for high-frequency updates. Event-sourcing pattern for audit trail.`,
        ['transaction', 'SELECT FOR UPDATE', 'optimistic locking', 'Redis', 'atomic', 'INCRBYFLOAT', 'audit']),

    q('Paytm', 'Backend', 'Hard', 'Technical',
        `What is the difference between idempotency and exactly-once delivery in distributed systems? How do you implement idempotency in a payment API?`,
        `Idempotency: same request produces same result regardless of retries. Exactly-once: guaranteed message delivered once (hard). Implement with idempotency keys: client sends unique key, server stores result keyed to it.`,
        ['idempotency', 'exactly-once', 'key', 'retry', 'store', 'distributed', 'payment']),

    // ==========================================================
    // RAZORPAY
    // ==========================================================
    q('Razorpay', 'Software Engineer', 'Hard', 'Technical',
        `Implement a retry queue with exponential backoff in JavaScript. Failed tasks should retry after 1s, 2s, 4s... up to 5 attempts.`,
        `async function withRetry(fn, maxAttempts=5){\n  for(let i=0;i<maxAttempts;i++){\n    try{ return await fn(); }\n    catch(e){\n      if(i===maxAttempts-1) throw e;\n      await new Promise(r=>setTimeout(r,Math.pow(2,i)*1000));\n    }\n  }\n}`,
        ['retry', 'exponential backoff', 'Math.pow', 'setTimeout', 'async', 'attempt']),

    q('Razorpay', 'Backend', 'Hard', 'Technical',
        `Explain how you would prevent replay attacks in a payment webhook system.`,
        `1. Include timestamp in payload. 2. Reject requests older than 5 minutes. 3. Validate HMAC signature using shared secret. 4. Store processed webhook IDs in Redis with TTL to deduplicate.`,
        ['replay attack', 'HMAC', 'signature', 'timestamp', 'deduplicate', 'Redis', 'TTL', 'webhook']),

    // ==========================================================
    // ORACLE
    // ==========================================================
    q('Oracle', 'Software Engineer', 'Hard', 'Technical',
        `Explain different types of database indexes (B-Tree, Hash, Bitmap, Composite). When would you use each?`,
        `B-Tree: default for range queries. Hash: exact match lookups (O(1)). Bitmap: low-cardinality columns (gender, status). Composite: multi-column queries. Avoid index on high-write columns.`,
        ['B-Tree', 'Hash', 'Bitmap', 'Composite', 'cardinality', 'range query', 'O(1)']),

    q('Oracle', 'Data Analyst', 'Hard', 'Technical',
        `Write a SQL query that pivots monthly sales data from rows to columns.\n\nInput: (year, month, sales)\nOutput: (year, Jan, Feb, Mar, ...)`,
        `SELECT year,\n  SUM(CASE WHEN month=1 THEN sales END) AS Jan,\n  SUM(CASE WHEN month=2 THEN sales END) AS Feb,\n  SUM(CASE WHEN month=3 THEN sales END) AS Mar\nFROM sales GROUP BY year;`,
        ['CASE WHEN', 'SUM', 'pivot', 'GROUP BY', 'conditional aggregation', 'month']),

    // ==========================================================
    // IBM
    // ==========================================================
    q('IBM', 'Software Engineer', 'Hard', 'Technical',
        `What is eventual consistency and how does it differ from strong consistency? Give examples of systems using each.`,
        `Strong consistency: all reads see latest write (RDBMS, Zookeeper). Eventual consistency: data converges over time (Cassandra, DynamoDB, DNS). Trade-off: availability vs. consistency (CAP theorem).`,
        ['eventual consistency', 'strong consistency', 'Cassandra', 'DynamoDB', 'CAP', 'RDBMS', 'Zookeeper']),

    q('IBM', 'Data Analyst', 'Hard', 'Technical',
        `Explain the difference between OLTP and OLAP. What database technology, schema design, and indexing strategies are best for each?`,
        `OLTP: transactional, normalized schema, row-store, BTREE indexes (MySQL, PostgreSQL). OLAP: analytical, star/snowflake schema, columnar store, bitmap indexes (Redshift, BigQuery, Snowflake).`,
        ['OLTP', 'OLAP', 'normalized', 'star schema', 'columnar', 'bitmap', 'Redshift', 'BigQuery']),

    // ==========================================================
    // TECH MAHINDRA
    // ==========================================================
    q('Tech Mahindra', 'Frontend', 'Hard', 'Technical',
        `Implement a function to convert a camelCase string to snake_case and vice versa.\n\ncamelToSnake("getUserName") → "get_user_name"\nsnakeToCamel("get_user_name") → "getUserName"`,
        `const camelToSnake=s=>s.replace(/[A-Z]/g,l=>'_'+l.toLowerCase());\nconst snakeToCamel=s=>s.replace(/_([a-z])/g,(_,l)=>l.toUpperCase());`,
        ['regex', 'replace', 'toLowerCase', 'toUpperCase', 'camelCase', 'snake_case']),

    q('Tech Mahindra', 'Backend', 'Hard', 'Technical',
        `Design a real-time leaderboard system for a gaming platform with 10 million users. Users scores update continuously. Top 100 should be retrievable in under 50ms.`,
        `Use Redis Sorted Sets (ZADD, ZRANGE). Store userId → score. Redis sorted set gives O(log n) inserts and O(1)~O(k) range queries. Persist to DB asynchronously via queue for durability.`,
        ['Redis', 'Sorted Set', 'ZADD', 'ZRANGE', 'O(log n)', 'leaderboard', 'real-time']),

    // ==========================================================
    // MPHASIS
    // ==========================================================
    q('Mphasis', 'Frontend', 'Hard', 'Technical',
        `What is Content Security Policy (CSP)? How does it protect against XSS attacks? Write a sample CSP header.`,
        `CSP restricts resources a page can load. Prevents XSS by disallowing inline scripts and restricting script sources.\nHeader: Content-Security-Policy: default-src 'self'; script-src 'self' cdn.example.com; style-src 'self' 'unsafe-inline';`,
        ['CSP', 'XSS', 'inline scripts', 'Content-Security-Policy', 'default-src', 'script-src', 'header']),

    q('Mphasis', 'Backend', 'Hard', 'Technical',
        `Implement middleware in Express.js that logs request method, URL, response status, and time taken for every API call.`,
        `app.use((req,res,next)=>{\n  const start=Date.now();\n  res.on('finish',()=>{\n    console.log(req.method, req.url, res.statusCode, Date.now()-start+'ms');\n  });\n  next();\n});`,
        ['middleware', 'Date.now', 'finish event', 'statusCode', 'logging', 'response time', 'Express']),

    // ==========================================================
    // BYJU'S
    // ==========================================================
    q("BYJU'S", 'Frontend', 'Hard', 'Technical',
        `You are building a video player component in React. The video should pause when it scrolls out of the viewport and resume when it comes back. Write the implementation.`,
        `Use IntersectionObserver API.\nconst ref=useRef();\nuseEffect(()=>{\n  const obs=new IntersectionObserver(([e])=>{\n    e.isIntersecting ? ref.current.play() : ref.current.pause();\n  },{threshold:0.5});\n  obs.observe(ref.current);\n  return ()=>obs.disconnect();\n},[]);`,
        ['IntersectionObserver', 'useRef', 'useEffect', 'play', 'pause', 'viewport', 'React']),

    q("BYJU'S", 'Data Analyst', 'Hard', 'Technical',
        `A student learning platform has 500,000 users. Write a SQL query to find students at risk of dropping out: those who were active last month but have 0 sessions in the last 7 days.`,
        `SELECT user_id FROM sessions WHERE session_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)\nGROUP BY user_id\nHAVING MAX(session_date) < DATE_SUB(CURDATE(), INTERVAL 7 DAY);`,
        ['HAVING', 'MAX', 'DATE_SUB', 'INTERVAL', 'churn', 'dropout', 'session']),
];

const seedDB = async () => {
    try {
        await connectDB();
        await User.deleteMany();
        await Question.deleteMany();

        await User.create({ name: 'Admin User', email: 'admin@betchiup.com', password: 'password123', role: 'admin' });
        await User.create({ name: 'Test Student', email: 'student@betchiup.com', password: 'password123', role: 'student' });

        await Question.insertMany(questions);

        const byCompany = {};
        questions.forEach(q => { byCompany[q.company] = (byCompany[q.company] || 0) + 1; });
        console.log(`\n✅ Database seeded! ${questions.length} REAL hard questions loaded.\n`);
        console.table(byCompany);
        process.exit();
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        process.exit(1);
    }
};

seedDB();
