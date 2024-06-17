import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Client from 'socket.io-client';
import {
  server as httpServer,
  io as ioServer,
  onlineUsers,
} from '../src/server';
import Logger from '../src/core/Logger';

describe('The Express server', () => {
  let serverSpy: jest.SpyInstance;
  let loggerInfoSpy: jest.SpyInstance;
  let loggerErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    httpServer.close();
    serverSpy = jest.spyOn(httpServer, 'listen');
    loggerInfoSpy = jest.spyOn(Logger, 'info');
    loggerErrorSpy = jest.spyOn(Logger, 'error');
  });

  afterEach(() => {
    httpServer.close();
    jest.clearAllMocks();
  });

  it('should listen to the port informed', () => {
    httpServer.listen(process.env.PORT || 3001);
    expect(serverSpy).toHaveBeenCalledWith(process.env.PORT || 3001);
    serverSpy.mockRestore();
  });

  it('should log events accordingly', async () => {
    await new Promise<void>((resolve) => {
      httpServer.listen(process.env.PORT, () => {
        Logger.info(`server running on port : ${process.env.PORT}`);
        resolve();
      });
    });
    expect(loggerInfoSpy).toHaveBeenCalled();

    httpServer.emit('error', new Error('Server startup error'));
    expect(loggerErrorSpy).toHaveBeenCalled();

    loggerInfoSpy.mockRestore();
    loggerErrorSpy.mockRestore();
  });
});

describe('The Socket.IO server', () => {
  let httpServerInstance: HttpServer;
  let spyLog: jest.SpyInstance;
  let ioServerInstance: SocketIOServer;
  let clientSocket: ReturnType<typeof Client>;
  let targetClientSocket: ReturnType<typeof Client>;

  beforeEach(() => {});

  beforeAll((done) => {
    spyLog = jest.spyOn(global.console, 'log');
    httpServerInstance = httpServer;
    ioServerInstance = ioServer;

    httpServerInstance.listen(() => {
      const port = (httpServerInstance.address() as any).port;
      targetClientSocket = Client(`http://localhost:${port}`, {
        reconnectionDelay: 0,
        forceNew: true,
        transports: ['websocket'],
      });
      clientSocket = Client(`http://localhost:${port}`, {
        reconnectionDelay: 0,
        forceNew: true,
        transports: ['websocket'],
      });
      let connectedClients = 0;

      const checkDone = () => {
        connectedClients++;
        if (connectedClients === 2) {
          done();
        }
      };

      clientSocket.on('connect', checkDone);
      targetClientSocket.on('connect', checkDone);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    onlineUsers.clear();
  });

  afterAll((done) => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
    if (targetClientSocket.connected) {
      targetClientSocket.disconnect();
    }
    httpServerInstance.close(done);
  });

  it('should handle incoming connections', () => {
    clientSocket.connect();

    expect(clientSocket.connected).toBe(true);
    expect(spyLog).toHaveBeenCalledWith(
      'DEV SERVER: user connected, online user count:',
      onlineUsers.size,
    );

    spyLog.mockRestore();
  });

  it('should handle an update event', (done) => {
    const updateData = { socketId: clientSocket.id, name: 'test' };
    onlineUsers.set(clientSocket.id || '1', 'updateName');

    clientSocket.emit('update', updateData, (response: { ok: boolean }) => {
      expect(response.ok).toBe(true);
    });

    clientSocket.once('update', (data) => {
      expect(data).toEqual(updateData);
      done();
    });
  });

  it('should handle new users joining the chat', (done) => {
    const joinData = { socketId: clientSocket.id || '1', name: 'testName' };
    const originalSize = onlineUsers.size;

    clientSocket.emit('join', joinData);

    setTimeout(() => {
      done();
      expect(onlineUsers.has(joinData.socketId)).toBe(true);
      expect(onlineUsers.get(joinData.socketId)).toBe(joinData.name);
      expect(onlineUsers.size).toBeGreaterThan(originalSize);
    }, 100);
  });

  it('should handle an incoming broadcast', (done) => {
    const broadcastData = { message: 'test', from: 'user' };

    clientSocket.once('broadcast', (data) => {
      expect(data).toEqual(broadcastData);
      done();
    });

    ioServerInstance.once('broadcast', (data) => {
      ioServerInstance.emit('broadcast', data);
    });

    clientSocket.emit(
      'broadcast',
      broadcastData,
      (response: { ok: boolean }) => {
        expect(response.ok).toBe(true);
      },
    );
  });

  it('should handle an incoming private message', (done) => {
    const privateMessageData = {
      message: 'test',
      from: clientSocket.id,
      to: targetClientSocket.id,
    };

    targetClientSocket.on('private_message', (data) => {
      expect(data).toEqual(privateMessageData);
    });

    clientSocket.emit(
      'private_message',
      privateMessageData,
      (response: { ok: boolean }) => {
        expect(response.ok).toBe(true);
      },
    );
    done();
  });

  it('should periodically emit a list with the online users', (done) => {
    const key = clientSocket.id || 'newSocket';
    const value = 'Testington';

    onlineUsers.set(key, value);

    clientSocket.once('online_user', (onlineUsers) => {
      done();
      expect(Object.keys(onlineUsers)).toContain(key);
      expect(onlineUsers[key]).toBe(value);
    });
  }, 3000);
});
