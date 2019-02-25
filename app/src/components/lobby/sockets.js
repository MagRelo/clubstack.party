import io from 'socket.io-client';
import store from 'state/store';

let socket = null;

export async function initSockets(contractAddress) {
  socket = io('/', {
    query: 'groupKey=' + contractAddress
  });
  socket.on('connect', () => {
    console.log('socket connected:', socket.id);
  });

  // servesa events
  socket.on('lobby-update', updateServerData);
  // socket.on('bounce-response', bounceResponse);

  // standard errors
  socket.on('reconnecting', reconnectError);
  socket.on('error', socketError);
  socket.on('disconnect', socketError);
  socket.on('connect_failed', socketError);
  socket.on('reconnect_failed', socketError);

  return true;
}

// socket handlers
async function updateServerData(data) {
  return store.dispatch({
    type: 'LOBBY_UPDATE',
    payload: data
  });
}

// export async function submitProposal(proposalData) {
//   socket.emit('submit-proposal', proposalData);
// }

// export async function submitVote(voteData) {
//   socket.emit('submit-vote', voteData);
// }

// export async function submitChat(message) {
//   socket.emit('submit-chat', message);
// }

// standard errors
function reconnectError(data) {
  if (data > 5) {
    socket.disconnect();
    console.log('disconnecting');
  } else {
    console.log('reconnection attempts: ', data);
  }
}
function socketError(error) {
  console.error('socket error!', error);
}
