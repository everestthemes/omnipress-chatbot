import { chatApi } from '@/src/api/chatApi';
import { Textarea } from '@/src/components/ui/textarea';
import { Bot, Maximize2, Minimize2, Send, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { Toaster } from 'sonner';

interface Message {
	content: string;
	role: 'user' | 'assistant';
}

const ChatPopup = () => {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ messages, setMessages ] = useState< Message[] >( [] );
	const [ inputValue, setInputValue ] = useState( '' );
	const [ isLoading, setIsLoading ] = useState( false );
	const messagesEndRef = useRef< HTMLDivElement >( null );
	const [ isMaximized, setIsMaximized ] = useState( false );

	const handleSend = async () => {
		if ( inputValue.trim() && ! isLoading ) {
			try {
				setIsLoading( true );
				const userMessage = inputValue;
				setInputValue( '' );
				setMessages( [
					...messages,
					{ content: userMessage, role: 'user' },
				] );

				const response = await chatApi.chat( {
					messages: messages,
					question: userMessage,
					client: 'chatbot',
				} );

				console.log( response, 'response')

				if ( response.success && response.data?.messages ) {
					setMessages( response.data.messages );
				}


				if ( messagesEndRef.current ) {
					messagesEndRef.current.scrollIntoView( {
						behavior: 'smooth',
					} );
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
			<Toaster richColors position="top-right" />

			{ isOpen ? (
				<div
					style={ {
						...styles.chatPopup,
						width: isMaximized ? '700px' : '350px',
						maxWidth: '100vw',
					} }
				>
					<div style={ styles.header }>
						<div style={ styles.headerContent }>
							<div style={ styles.logo }>
								<Bot
									size={ 18 }
									color="var(--text-color, white)"
								/>
								<span style={ styles.logoText }>
									AI Assistant
								</span>
								<div style={ styles.statusDot }></div>
							</div>

							<div
								style={ {
									display: 'flex',
									gap: '4px',
								} }
							>
								<button
									style={ styles.headerButton }
									onClick={ () =>
										setIsMaximized( ! isMaximized )
									}
								>
									{ isMaximized ? (
										<Minimize2
											color="var(--text-color, white)"
											size={ 14 }
										/>
									) : (
										<Maximize2
											color="var(--text-color, white)"
											size={ 14 }
										/>
									) }
								</button>
								<button
									style={ styles.headerButton }
									onClick={ toggleChat }
								>
									<X
										size={ 20 }
										color="var(--text-color, white)"
									/>
								</button>
							</div>
						</div>
					</div>

					<div style={ styles.messagesContainer }>
						{ messages.length > 0 ? (
							<>
								{ messages.map( ( message, index ) => (
									<div
										ref={
											index === messages.length - 1
												? messagesEndRef
												: null
										}
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
											{ message.role === 'assistant' ? (
												<Markdown
													components={ {
														a: ( {
															node,
															...props
														} ) => (
															<a
																{ ...props }
																style={ {
																	color: 'var(--link-color, #4F46E5)',
																} }
																target="_blank"
																rel="noopener noreferrer"
															/>
														),
													} }
												>
													{ message.content }
												</Markdown>
											) : (
												message.content
											) }
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
							rows={ 4 }
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
								height: 'auto',
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
							<Send
								size={ 16 }
								color="var(--text-color, white)"
							/>
						</button>
					</div>

					{ /* questions list */ }
					{ messages.length === 0 && (
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
					) }
				</div>
			) : (
				<button
					onClick={ toggleChat }
					style={ { ...styles.chatIconButton } }
					className="chatIconButton"
				>
					<div style={ styles.buttonInner } className="buttonInner">
						<span
							style={ {
								marginRight: '4px',
								color: 'var(--text-color, white)',
							} }
						>
							Ask AI{ ' ' }
						</span>
						<Sparkles
							size={ 14 }
							color="var(--text-color, white)"
						/>
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
		background: 'var(--bg-color, linear-gradient(135deg, #4F46E5, #7C3AED)',
		color: 'var(--text-color, white)',
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
		height: '100vh',
		backgroundColor: 'white',
		boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
		display: 'flex',
		flexDirection: 'column',
		overflow: 'hidden',
		animation: 'slideUp 0.3s ease-out',
	},
	header: {
		background: 'var(--bg-color, linear-gradient(135deg, #4F46E5, #7C3AED)',
		color: 'var(--text-color, white)',
		padding: '15px 20px',
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
		width: '17px',
		height: '20px',
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
		background: 'var(--bg-color, linear-gradient(135deg, #4F46E5, #7C3AED)',
		color: 'var(--text-color, white)',
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
		backgroundColor: 'var(--bg-color,#4F46E5)',
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
		background: 'var(--bg-color, linear-gradient(135deg, #4F46E5, #7C3AED)',
		color: 'var(--text-color, white)',
		border: 'none',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		transition: 'transform 0.2s, opacity 0.2s',
		flexShrink: 0,
	},
	bottomActions: {
		padding: '15px 20px',
		display: 'flex',
		position: 'absolute',
		bottom: '0',
		right: '0',
		backgroundColor: 'transparent',
		justifyContent: 'center',
		gap: '15px',
		borderTop: '1px solid #E5E5E5',
	},
	actionButton: {
		width: '50px',
		height: '50px',
		padding: '0',
		borderRadius: '50%',
		background: 'var(--bg-color, linear-gradient(135deg, #4F46E5, #7C3AED)',
		color: 'var(--text-color, white)',
		border: 'none',
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
		alignItems: 'flex-start',
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
		backgroundColor: 'var(--bg-color,#4F46E5)',
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
