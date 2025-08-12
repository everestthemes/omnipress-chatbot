import { chatApi } from '@/src/api/chatApi';
import { Textarea } from '@/src/components/ui/textarea';
import { Bot, Lock, Search, Send, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Message {
	content: string;
	role: 'user' | 'assistant';
}

const ChatPopup = () => {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ messages, setMessages ] = useState< Message[] >( [] );
	const [ inputValue, setInputValue ] = useState( '' );
	const [ isLoading, setIsLoading ] = useState( false );

	const handleSend = async () => {
		if ( inputValue.trim() && ! isLoading ) {
			try {
				setIsLoading( true );
				const userMessage = inputValue;
				setInputValue( '' );
				setMessages( [...messages, { content: userMessage, role: 'user' } ] );

				const response = await chatApi.chat( {
					messages: messages,
					question: userMessage,
					client: 'chatbot',
				} );

				if ( response.success && response.data?.messages ) {
					setMessages( response.data.messages );
				}
			} catch ( error ) {
				console.log( error );
			} finally {
				setIsLoading( false );
			}
		}
	};

	const toggleChat = () => {
		setIsOpen( ! isOpen );
	};

	useEffect( () => {
		document.body.style.marginRight = isOpen ? '350px' : '0';
		document.body.style.transition = 'margin-right 0.3s ease-in-out';
	}, [ isOpen ] );

	// Loading dots component
	const LoadingDots = () => (
		<div style={ styles.loadingContainer }>
			<div style={ styles.avatar }>AI</div>
			<div style={ styles.loadingMessage }>
				<div style={ styles.loadingDots }>
					<div style={ styles.dot }></div>
					<div style={ styles.dot }></div>
					<div style={ styles.dot }></div>
				</div>
			</div>
		</div>
	);

	return (
		<div style={ styles.container }>
			{ isOpen ? (
				<div style={ styles.chatPopup }>
					<div style={ styles.header }>
						<div style={ styles.headerContent }>
							<div style={ styles.logo }>
								<Bot size={ 18 } color="white" />
								<span style={ styles.logoText }>
									AI Assistant
								</span>
								<div style={ styles.statusDot }></div>
							</div>
							<div style={ styles.headerActions }>
								<button style={ styles.headerButton }>
									<Search size={ 14 } color="white" />
								</button>
								<button style={ styles.headerButton }>
									<Lock size={ 14 } color="white" />
								</button>
							</div>
						</div>
					</div>

					<div style={ styles.messagesContainer }>
						{ messages.length > 0 ? (
							<>
								{ messages.map( ( message ) => (
									<div
										key={ message.content }
										style={ {
											...styles.messageWrapper,
											...( message.role === 'user'
												? styles.userMessageWrapper
												: styles.otherMessageWrapper ),
										} }
									>
										{ message.role === 'assistant' && (
											<div style={ styles.avatar }>
												AI
											</div>
										) }
										<div
											style={ {
												...styles.message,
												...( message.role === 'user'
													? styles.userMessage
													: styles.otherMessage ),
											} }
										>
											{ message.content }
										</div>
										{ message.role === 'user' && (
											<div style={ styles.avatar }>U</div>
										) }
									</div>
								) ) }
								{ /* Show loading state */ }
								{ isLoading && <LoadingDots /> }
							</>
						) : (
							<p style={ styles.placeholder }>
								Ask me a qustions about omnipress and everest
								backup...
							</p>
						) }
					</div>

					<div style={ styles.inputContainer }>
						<Textarea
							placeholder={
								isLoading
									? 'AI is thinking...'
									: 'Ask me a qustions about omnipress and everest backup...'
							}
							disabled={ isLoading }
							rows={ 2 }
							value={ inputValue }
							onChange={ ( e ) =>
								setInputValue( e.target.value )
							}
							onKeyDown={ ( e ) =>
								e.key === 'Enter' &&
								! e.shiftKey &&
								handleSend()
							}
							style={ {
								...styles.input,
								opacity: isLoading ? 0.6 : 1,
								cursor: isLoading ? 'not-allowed' : 'text',
							} }
						/>
						<button
							onClick={ handleSend }
							disabled={ isLoading || ! inputValue.trim() }
							style={ {
								...styles.sendButton,
								opacity:
									isLoading || ! inputValue.trim() ? 0.5 : 1,
								cursor:
									isLoading || ! inputValue.trim()
										? 'not-allowed'
										: 'pointer',
							} }
						>
							<Send size={ 16 } color="white" />
						</button>
					</div>

					{ /* example questions list */ }
					<div style={ styles.exampleQuestionsList }>
						{ [
							'What is omnipress?',
							'What can i do with omnipress plugin?',
							'How to install omnipress plugin?',
							'Can we migrate website using everest backup?',
						].map( ( question ) => (
							<p
								key={ question }
								onClick={ () =>
									! isLoading && setInputValue( question )
								}
								style={ {
									...styles.exampleQuestion,
									opacity: isLoading ? 0.5 : 1,
									cursor: isLoading
										? 'not-allowed'
										: 'pointer',
								} }
							>
								{ question }
							</p>
						) ) }
					</div>

					<div style={ styles.bottomActions }>
						<button style={ styles.actionButton }>
							<Bot size={ 20 } color="white" />
						</button>
						<button
							onClick={ toggleChat }
							style={ styles.actionButton }
						>
							<X size={ 20 } color="white" />
						</button>
					</div>
				</div>
			) : (
				<button
					onClick={ toggleChat }
					style={ { ...styles.chatIconButton } }
					className="chatIconButton"
				>
					<div style={ styles.buttonInner } className="buttonInner">
						<span style={ { marginRight: '4px' } }>Ask AI </span>
						<Sparkles size={ 14 } color="white" />
					</div>
					<div style={ styles.ripple }></div>
				</button>
			) }
		</div>
	);
};

const styles: Record< string, React.CSSProperties > = {
	container: {
		position: 'fixed',
		bottom: '20px',
		right: '20px',
		zIndex: 10000000,
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
	},
	chatIconButton: {
		width: '110px',
		height: '50px',
		padding: '0',
		borderRadius: '4px',
		background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
		border: 'none',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)',
		transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
		position: 'relative',
		overflow: 'hidden',
	},
	chatPopup: {
		position: 'fixed',
		bottom: '0',
		right: '0',
		width: '350px',
		height: '100vh',
		backgroundColor: 'white',
		boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
		display: 'flex',
		flexDirection: 'column',
		overflow: 'hidden',
		animation: 'slideUp 0.3s ease-out',
	},
	header: {
		background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
		padding: '15px 20px',
		color: 'white',
	},
	headerContent: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	logo: {
		display: 'flex',
		alignItems: 'center',
		gap: '8px',
	},
	logoIcon: {
		fontSize: '18px',
	},
	logoText: {
		fontWeight: '600',
		fontSize: '16px',
	},
	statusDot: {
		width: '8px',
		height: '8px',
		borderRadius: '50%',
		backgroundColor: '#10B981',
		marginLeft: '8px',
		animation: 'pulse-dot 2s infinite',
	},
	buttonInner: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		color: 'white',
		zIndex: 2,
		transition: 'transform 0.2s ease',
	},
	ripple: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		width: '100%',
		height: '100%',
		borderRadius: '50%',
		background: 'rgba(255, 255, 255, 0.1)',
		transform: 'translate(-50%, -50%) scale(0)',
		animation: 'ripple 2s infinite',
	},
	headerActions: {
		display: 'flex',
		gap: '8px',
	},
	headerButton: {
		background: 'rgba(255, 255, 255, 0.2)',
		border: 'none',
		borderRadius: '8px',
		width: '32px',
		height: '32px',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		transition: 'background-color 0.2s',
	},
	messagesContainer: {
		flex: 1,
		padding: '20px',
		overflowY: 'auto',
		display: 'flex',
		flexDirection: 'column',
		gap: '15px',
		backgroundColor: '#FAFAFA',
	},
	messageWrapper: {
		display: 'flex',
		alignItems: 'flex-end',
		gap: '8px',
	},
	userMessageWrapper: {
		justifyContent: 'flex-end',
	},
	otherMessageWrapper: {
		justifyContent: 'flex-start',
	},
	message: {
		maxWidth: '75%',
		padding: '12px 16px',
		borderRadius: '18px',
		fontSize: '14px',
		lineHeight: '1.4',
		wordWrap: 'break-word',
	},
	userMessage: {
		background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
		color: 'white',
		borderBottomRightRadius: '6px',
	},
	otherMessage: {
		backgroundColor: 'white',
		color: '#333',
		borderBottomLeftRadius: '6px',
		border: '1px solid #E5E5E5',
	},
	avatar: {
		width: '32px',
		height: '32px',
		borderRadius: '50%',
		objectFit: 'cover',
		flexShrink: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: 'white',
		fontSize: '14px',
		fontWeight: '600',
		backgroundColor: '#4F46E5',
	},
	inputContainer: {
		backgroundColor: 'white',
		position: 'relative',
		padding: '15px 20px',
		display: 'flex',
		alignItems: 'center',
		gap: '10px',
		borderTop: '1px solid #E5E5E5',
	},
	input: {
		flex: 1,
		border: '1px solid #E0E0E0',
		borderRadius: '20px',
		padding: '10px 16px',
		fontSize: '14px',
		outline: 'none',
		backgroundColor: '#F8F8F8',
		transition: 'border-color 0.2s, opacity 0.2s',
	},
	sendButton: {
		width: '40px',
		height: '40px',
		position: 'absolute',
		right: '30px',
		bottom: '20px',
		padding: '0',
		borderRadius: '50%',
		background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
		border: 'none',
		color: 'white',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		transition: 'transform 0.2s, opacity 0.2s',
		flexShrink: 0,
	},
	bottomActions: {
		backgroundColor: 'white',
		padding: '15px 20px',
		display: 'flex',
		justifyContent: 'center',
		gap: '15px',
		borderTop: '1px solid #E5E5E5',
	},
	actionButton: {
		width: '50px',
		height: '50px',
		padding: '0',
		borderRadius: '50%',
		background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
		border: 'none',
		color: 'white',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		transition: 'transform 0.2s, box-shadow 0.2s',
	},
	exampleQuestionsList: {
		display: 'flex',
		flexDirection: 'column',
		gap: '10px',
		padding: '10px',
	},
	exampleQuestion: {
		fontSize: '14px',
		color: '#333',
		cursor: 'pointer',
		margin: '0',
		padding: '4px 12px',
		border: '1px solid #E5E5E5',
		borderRadius: '6px',
		transition: 'color 0.2s, opacity 0.2s',
	},
	// Loading state styles
	loadingContainer: {
		display: 'flex',
		alignItems: 'flex-end',
		gap: '8px',
		justifyContent: 'flex-start',
	},
	loadingMessage: {
		backgroundColor: 'white',
		border: '1px solid #E5E5E5',
		borderRadius: '18px',
		borderBottomLeftRadius: '6px',
		padding: '12px 16px',
		maxWidth: '75%',
	},
	loadingDots: {
		display: 'flex',
		gap: '4px',
		alignItems: 'center',
	},
	dot: {
		width: '8px',
		height: '8px',
		borderRadius: '50%',
		backgroundColor: '#4F46E5',
		animation: 'loading-bounce 1.4s ease-in-out infinite both',
	},
};

// Add CSS animations for clean AI effects
const styleSheet = document.createElement( 'style' );
styleSheet.innerHTML = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes ripple {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(4);
      opacity: 0;
    }
  }

  @keyframes pulse-dot {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.1);
    }
  }

  @keyframes loading-bounce {
    0%, 80%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .chatIconButton:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 12px 35px rgba(79, 70, 229, 0.5);
  }

  .chatIconButton:hover .buttonInner {
    transform: scale(1.1);
  }

  .chatIconButton:active {
    transform: translateY(0) scale(0.95);
  }

  input:focus {
    border-color: #4F46E5 !important;
  }

  /* Stagger the loading dot animations */
  .loading-dots .dot:nth-child(1) {
    animation-delay: -0.32s;
  }

  .loading-dots .dot:nth-child(2) {
    animation-delay: -0.16s;
  }

  .loading-dots .dot:nth-child(3) {
    animation-delay: 0s;
  }
`;
document.head.appendChild( styleSheet );

export default ChatPopup;
