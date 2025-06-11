package com.servitask.service;

import com.servitask.model.Board;
import com.servitask.model.BoardColumn;
import com.servitask.model.Card;
import com.servitask.servitask.entity.User;
import com.servitask.repository.BoardRepository;
import com.servitask.repository.BoardColumnRepository;
import com.servitask.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;  

@Service                    //componente de serviço do Spring
@RequiredArgsConstructor    //gera construtor com todos os campos finais
@Transactional              //todas as operações deste serviço serão transacionais
public class BoardService {
    private final BoardRepository boardRepository;   
    private final BoardColumnRepository boardColumnRepository;
    private final CardRepository cardRepository;

    //OPERAÇÕES DE BOARD

    public Board createBoard(String name, User user) {
        Board board = new Board();
        board.setName(name);
        board.setUser(user);

        Board savedBoard = boardRepository.save(board);

        createDefaultColumns(savedBoard);

        return boardRepository.findById(savedBoard.getId()).orElse(savedBoard);
    }

    private void createDefaultColumns(Board board) {
        String[] defaultColumnNames = {"A Fazer", "A Progresso", "Revisão", "Concluído"};

        // cria cada coluna com posição sequencial
        for (int i = 0; i < defaultColumnNames.length; i++) {
            BoardColumn column = new BoardColumn();
            column.setName(defaultColumnNames[i]);
            column.setPosition(i + 1);
            column.setBoard(board);
            boardColumnRepository.save(column);
        }
    }

    @Transactional(readOnly = true)
    public List<Board> getUserBoards(User user){
        return boardRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Transactional(readOnly = true)
    public Optional<Board> getBoardById(Long boardId, User user){
        return boardRepository.findByIdAndUser(boardId, user);
    }

    public Optional<Board> updateBoardName(Long boardId, String newName, User user){
        Optional<Board> boardOpt = boardRepository.findByIdAndUser(boardId, user);
        if (boardOpt.isPresent()){
            Board board = boardOpt.get();
            board.setName(newName);
            return Optional.of(boardRepository.save(board));
        }
        return Optional.empty();
    }

    public boolean deleteBoard(Long boardId, User user){
        Optional<Board> boardOpt = boardRepository.findByIdAndUser(boardId, user);
        if (boardOpt.isPresent()) {
            boardRepository.delete(boardOpt.get());
            return true;
        }
        return false;
    }

    //OPERAÇÕES DE COLUNA

    public Optional<BoardColumn> addColumn(Long boardId, String columnName, User user) {
        Optional<Board> boardOpt = boardRepository.findByIdAndUser(boardId, user);
        if (boardOpt.isPresent()) {
            Board board = boardOpt.get();
            
            // Calcula a próxima posição disponível
            Integer nextPosition = columnRepository.findNextPosition(board);
            
            // Cria a nova coluna
            BoardColumn column = new BoardColumn();
            column.setName(columnName);
            column.setPosition(nextPosition);
            column.setBoard(board);
            
            return Optional.of(columnRepository.save(column));
        }
        return Optional.empty();
    }

    public Optional<BoardColumn> updateColumnName(Long boardId, Long columnId, String newName, User user) {
        Optional<Board> boardOpt = boardRepository.findByIdAndUser(boardId, user);
        if (boardOpt.isPresent()) {
            Optional<BoardColumn> columnOpt = columnRepository.findByIdAndBoard(columnId, boardOpt.get());
            if (columnOpt.isPresent()) {
                BoardColumn column = columnOpt.get();
                column.setName(newName);  // setName já atualiza updatedAt
                return Optional.of(columnRepository.save(column));
            }
        }
        return Optional.empty();
    }

     public boolean removeColumn(Long boardId, Long columnId, User user) {
        Optional<Board> boardOpt = boardRepository.findByIdAndUser(boardId, user);
        if (boardOpt.isPresent()) {
            Optional<BoardColumn> columnOpt = columnRepository.findByIdAndBoard(columnId, boardOpt.get());
            if (columnOpt.isPresent()) {
                BoardColumn column = columnOpt.get();
                
                // Reordena as colunas que vêm depois (diminui posição em 1)
                List<BoardColumn> columnsToUpdate = columnRepository
                    .findByBoardAndPositionGreaterThanOrderByPosition(boardOpt.get(), column.getPosition());
                
                columnsToUpdate.forEach(col -> col.setPosition(col.getPosition() - 1));
                columnRepository.saveAll(columnsToUpdate);
                
                // Remove a coluna (cascade remove os cards)
                columnRepository.delete(column);
                return true;
            }
        }
        return false;
    }

    //OPERAÇÕES DE CARD

    public Optional<Card> addCard(long boardId, Long columnId, String title, String description, String priority, User user){
        if (boardOpt.isPresent()) {
            Optional<BoardColumn> columnOpt = columnRepository.findByIdAndBoard(columnId, boardOpt.get());
            if (columnOpt.isPresent()) {
                BoardColumn column = columnOpt.get();

                Integer nextPosition = cardRepository.findNextPosition(column);

                Card card = new Card();
                card.setTitle(title);
                card.setDescription(description);
                card.setPriority(Card.Priority.fromString(priority));
                card.setPosition(nextPosition);
                card.setColumn(column);

                return Optional.of(cardRepository.save(card));
            }
        }
        return Optional.empty();
    }

    public Optional<Card> updateCard(Long boardId, Long columnId, Long cardId, String title, 
                                   String description, String priority, User user) {
        Optional<Board> boardOpt = boardRepository.findByIdAndUser(boardId, user);
        if (boardOpt.isPresent()) {
            Optional<BoardColumn> columnOpt = columnRepository.findByIdAndBoard(columnId, boardOpt.get());
            if (columnOpt.isPresent()) {
                Optional<Card> cardOpt = cardRepository.findByIdAndColumn(cardId, columnOpt.get());
                if (cardOpt.isPresent()) {
                    Card card = cardOpt.get();
                    card.setTitle(title);
                    card.setDescription(description);
                    card.setPriority(Card.Priority.fromString(priority));
                    
                    return Optional.of(cardRepository.save(card));
                }
            }
        }
        return Optional.empty();
    }
    
    public boolean removeCard(Long boardId, Long columnId, Long cardId, User user) {
        Optional<Board> boardOpt = boardRepository.findByIdAndUser(boardId, user);
        if (boardOpt.isPresent()) {
            Optional<BoardColumn> columnOpt = columnRepository.findByIdAndBoard(columnId, boardOpt.get());
            if (columnOpt.isPresent()) {
                Optional<Card> cardOpt = cardRepository.findByIdAndColumn(cardId, columnOpt.get());
                if (cardOpt.isPresent()) {
                    Card card = cardOpt.get();
                    
                    // Reordena os cards que vêm depois (diminui posição em 1)
                    List<Card> cardsToUpdate = cardRepository
                        .findByColumnAndPositionGreaterThanOrderByPosition(columnOpt.get(), card.getPosition());
                    
                    cardsToUpdate.forEach(c -> c.setPosition(c.getPosition() - 1));
                    cardRepository.saveAll(cardsToUpdate);
                    
                    // Remove o card
                    cardRepository.delete(card);
                    return true;
                }
            }
        }
        return false;
    }
    
    public Optional<Card> moveCard(Long boardId, Long cardId, Long targetColumnId, Integer targetPosition, User user) {
        Optional<Board> boardOpt = boardRepository.findByIdAndUser(boardId, user);
        if (boardOpt.isPresent()) {
            Optional<BoardColumn> targetColumnOpt = columnRepository.findByIdAndBoard(targetColumnId, boardOpt.get());
            if (targetColumnOpt.isPresent()) {
                
                // Encontra o card em qualquer coluna do board
                Card card = null;
                BoardColumn originalColumn = null;
                
                for (BoardColumn column : boardOpt.get().getColumns()) {
                    Optional<Card> cardOpt = cardRepository.findByIdAndColumn(cardId, column);
                    if (cardOpt.isPresent()) {
                        card = cardOpt.get();
                        originalColumn = column;
                        break;
                    }
                }
                
                if (card != null && originalColumn != null) {
                    BoardColumn targetColumn = targetColumnOpt.get();
                    
                    // Se está mudando de coluna 
                    if (!originalColumn.getId().equals(targetColumn.getId())) {
                        
                        // 1. Reordena cards na coluna original
                        List<Card> originalColumnCards = cardRepository
                            .findByColumnAndPositionGreaterThanOrderByPosition(originalColumn, card.getPosition());
                        originalColumnCards.forEach(c -> c.setPosition(c.getPosition() - 1));
                        cardRepository.saveAll(originalColumnCards);
                        
                        // 2. Calcula nova posição na coluna de destino
                        Integer newPosition = targetPosition != null ? targetPosition : 
                                            cardRepository.findNextPosition(targetColumn);
                        
                        // 3. Abre espaço na coluna de destino se necessário
                        if (targetPosition != null) {
                            List<Card> targetColumnCards = cardRepository
                                .findByColumnAndPositionGreaterThanOrderByPosition(targetColumn, targetPosition - 1);
                            targetColumnCards.forEach(c -> c.setPosition(c.getPosition() + 1));
                            cardRepository.saveAll(targetColumnCards);
                        }
                        
                        // 4. Move o card para a nova coluna e posição
                        card.setColumn(targetColumn);
                        card.setPosition(newPosition);
                    }
                    
                    return Optional.of(cardRepository.save(card));
                }
            }
        }
        return Optional.empty();
    }
}
